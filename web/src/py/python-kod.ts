// The Python that runs inside Pyodide (loaded once per engine). It runs the learner's code with its output
// streamed to a callback, describes an error as plain data, and answers the three kinds of checks. Comparing and
// the Swedish wording are done in TypeScript (rattning.ts, felmeddelanden.ts), so that they can be tested without it.
export const PYTHON_KOD = `
import sys, json, math, builtins, os, shutil

_ARBETE = "/tmp/kurs"

def _satt_filer(filer_json):
    # A fresh working directory for every run: the lesson's files and nothing left over from earlier runs.
    os.chdir("/tmp")
    shutil.rmtree(_ARBETE, ignore_errors=True)
    os.makedirs(_ARBETE, exist_ok=True)
    os.chdir(_ARBETE)
    for namn, innehall in json.loads(filer_json).items():
        with open(os.path.join(_ARBETE, namn), "w", encoding="utf-8", newline="") as f:
            f.write(innehall)

def _las_fil(namn):
    try:
        with open(os.path.join(_ARBETE, namn), encoding="utf-8", newline="") as f:
            return json.dumps({"finns": True, "text": f.read()})
    except OSError:
        return json.dumps({"finns": False, "text": ""})

class _ForMycket(Exception):
    pass

def _lika(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return type(a) is type(b) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return len(a) == len(b) and all(_lika(x, y) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(_lika(a[k], b[k]) for k in a)
    return a == b

class _Ut:
    def __init__(self, cb, limit):
        self.cb, self.limit, self.n, self.text = cb, limit, 0, ""
    def write(self, s):
        self.n += len(s)
        if self.n > self.limit:
            raise _ForMycket()
        self.text += s
        self.cb(s)
        return len(s)
    def flush(self):
        pass

def _fel(e):
    rad = None
    if isinstance(e, SyntaxError):
        rad = e.lineno
        meddelande = e.msg
    else:
        meddelande = str(e)
        tb = e.__traceback__
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == "<kod>":
                rad = tb.tb_lineno
            tb = tb.tb_next
    return {"typ": type(e).__name__, "meddelande": meddelande, "rad": rad}

_ns = {}

def _kor(kod, cb, limit):
    global _ns
    _ns = {"__name__": "__main__"}
    gammal = (sys.stdout, sys.stderr)
    sys.stdout = sys.stderr = _Ut(cb, limit)
    fel = None
    try:
        exec(compile(kod, "<kod>", "exec"), _ns)
    except BaseException as e:
        fel = _fel(e)
    finally:
        sys.stdout, sys.stderr = gammal
    return json.dumps({"fel": fel})

def _variabel(namn, forvantat_json):
    if namn not in _ns:
        return json.dumps({"finns": False, "lika": False, "faktisk": ""})
    return json.dumps({"finns": True, "lika": bool(_lika(_ns[namn], json.loads(forvantat_json))), "faktisk": repr(_ns[namn])})

def _funktion(namn, indata_json, svar_json):
    f = _ns.get(namn)
    if not callable(f):
        return json.dumps({"finns": False, "lika": False, "faktisk": "", "fel": None})
    try:
        r = f(*json.loads(indata_json))
    except BaseException as e:
        return json.dumps({"finns": True, "lika": False, "faktisk": "", "fel": _fel(e)})
    return json.dumps({"finns": True, "lika": bool(_lika(r, json.loads(svar_json))), "faktisk": repr(r), "fel": None})

class _ForMangaSteg(Exception):
    pass

def _visa(v):
    if callable(v) and hasattr(v, "__name__") and not isinstance(v, type):
        return "<funktion " + v.__name__ + ">"
    r = repr(v)
    return r if len(r) <= 60 else r[:57] + "..."

def _snap(frame):
    ut = []
    for namn, v in frame.f_locals.items():
        if namn.startswith("__"):
            continue
        ut.append([namn, _visa(v)])
    return ut

def _stega(kod, cb, limit, maxsteg):
    global _ns
    _ns = {"__name__": "__main__"}
    gammal = (sys.stdout, sys.stderr)
    ut = _Ut(cb, limit)
    sys.stdout = sys.stderr = ut
    steg = []
    avbruten = False
    fel = None

    def spar(frame, event, arg):
        if frame.f_code.co_filename != "<kod>":
            return None
        if event == "line":
            if len(steg) >= maxsteg:
                raise _ForMangaSteg()
            namn = frame.f_code.co_name
            steg.append({"rad": frame.f_lineno, "variabler": _snap(frame), "utdata": ut.text, "funktion": None if namn == "<module>" else namn})
        return spar

    try:
        sys.settrace(spar)
        exec(compile(kod, "<kod>", "exec"), _ns)
    except _ForMangaSteg:
        avbruten = True
    except BaseException as e:
        fel = _fel(e)
    finally:
        sys.settrace(None)
        sys.stdout, sys.stderr = gammal
    steg.append({"rad": None, "variabler": [[n, _visa(v)] for n, v in _ns.items() if not n.startswith("__")], "utdata": ut.text, "funktion": None})
    return json.dumps({"steg": steg, "fel": fel, "avbruten": avbruten})
`;
