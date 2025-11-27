export function normalizeLang(value) {
    if (!value) return null;
    const v = String(value).toLowerCase();
    if (v === "en") return "en";
    if (v === "bn" || v === "bangla" || v === "bengali") return "ban";
    if (v === "ban") return "ban";
    return null;
}

export function langMiddleware(req, res, next) {
    try {
        let q = null;
        if (req && req.query && typeof req.query.lang !== "undefined") {
            q = normalizeLang(req.query.lang);
        }

        let cookieLang = null;
        if (req && req.cookies && typeof req.cookies.lang !== "undefined") {
            cookieLang = normalizeLang(req.cookies.lang);
        }

        let headerLang = null;
        if (req && req.headers && typeof req.headers["accept-language"] !== "undefined") {
            const header = req.headers["accept-language"];
            if (header) {
                const first = String(header).split(",")[0];
                headerLang = normalizeLang(first);
            }
        }

        const resolved = q || cookieLang || headerLang || "en";

        req.lang = resolved;

        if (!cookieLang || cookieLang !== resolved) {
            res.cookie("lang", resolved, {
                httpOnly: false,
                sameSite: "lax",
                maxAge: 365 * 24 * 60 * 60 * 1000
            });
        }

        next();
    } catch (error) {
       console.log(error.message)
        req.lang = "en";
        try {
            res.cookie("lang", "en", {
                httpOnly: false,
                sameSite: "lax",
                maxAge: 365 * 24 * 60 * 60 * 1000
            });
        } catch {}
        next();
    }
}
