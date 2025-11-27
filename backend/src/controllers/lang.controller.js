import User from "../models/auth.model.js"
import mongoose from "mongoose"
import { normalizeLang } from "../middlewares/lang.middleware.js"

export function getLang(req, res) {
	try {
		const q = normalizeLang(req.query.lang);
		let fromCookie = null;
		if (req && req.cookies && req.cookies.lang) {
			fromCookie = normalizeLang(req.cookies.lang);
		}
		const resolved = req.lang || q || fromCookie || "en";
		return res.status(200).json({ success: true, language: resolved });
	} catch (error) {
		console.log(error.message)
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
}

export async function langSwitch(req, res) {
	let input;
	if (req && req.body && typeof req.body.lang !== "undefined") {
		input = req.body.lang;
	} else if (req && req.query && typeof req.query.lang !== "undefined") {
		input = req.query.lang;
	}
	const lang = normalizeLang(input);

	if (!lang) {
		return res.status(400).json({ success: false, message: "Invalid language" });
	}

	try {
		res.cookie("lang", lang, {
			httpOnly: false,
			sameSite: "lax",
			maxAge: 365 * 24 * 60 * 60 * 1000
		});

		let updated = null;
		const { userId } = req.body || {};
		if (userId && mongoose.Types.ObjectId.isValid(userId)) {
			updated = await User.findByIdAndUpdate(
				userId,
				{ language: lang },
				{ new: true }
			).select("_id language");
		}

		return res.status(200).json({
			success: true,
			language: lang,
			user: updated,
			message: "Language updated"
		});
	} catch (error) {
		console.log(error.message)
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
}
