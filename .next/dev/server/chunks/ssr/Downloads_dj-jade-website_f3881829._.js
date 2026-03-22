module.exports = [
"[project]/Downloads/dj-jade-website/lib/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* ─────────────────────────────────────────────────────────
   Site content — edit this file to update events, mixes, etc.
   ───────────────────────────────────────────────────────── */ __turbopack_context__.s([
    "FORMSPREE_BOOKING",
    ()=>FORMSPREE_BOOKING,
    "FORMSPREE_NEWSLETTER",
    ()=>FORMSPREE_NEWSLETTER,
    "featuredTrack",
    ()=>featuredTrack,
    "merchItems",
    ()=>merchItems,
    "pastEvents",
    ()=>pastEvents,
    "socialLinks",
    ()=>socialLinks,
    "tracks",
    ()=>tracks,
    "upcomingEvents",
    ()=>upcomingEvents
]);
const upcomingEvents = [];
const pastEvents = [
    {
        id: "p1",
        title: "Hidden Gem Feb 2026",
        date: "2026-02-15",
        venue: "Fish Pot Studios",
        city: "New Orleans",
        state: "LA",
        flyerImage: "/images/flyer-feb-2026.jpg",
        isPast: true
    }
];
const featuredTrack = {
    id: "featured",
    title: "Sunset Playlist",
    embedSrc: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2192742440&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    visual: true
};
const tracks = [
    {
        id: "t1",
        title: "UNCUT VOL. 1",
        embedSrc: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1982508040&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
    },
    {
        id: "t2",
        title: "Fire Mix Vol. 2",
        embedSrc: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/jadethegem888&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
    },
    {
        id: "t3",
        title: "504 Bounce Session",
        embedSrc: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/jadethegem888&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
    }
];
const merchItems = [
    {
        id: "m1",
        name: "504 Creative Tee",
        price: "$30",
        image: "/images/merch-tee-1.jpg",
        link: ""
    },
    {
        id: "m2",
        name: "Jade The Gem Logo Tee",
        price: "$30",
        image: "/images/merch-tee-2.jpg",
        link: ""
    },
    {
        id: "m3",
        name: "NOLA Energy Tee",
        price: "$30",
        image: "/images/merch-tee-3.jpg",
        link: ""
    }
];
const socialLinks = [
    {
        platform: "Instagram",
        handle: "@jluhvv",
        url: "https://instagram.com/jluhvv"
    },
    {
        platform: "SoundCloud",
        handle: "jadethegem888",
        url: "https://soundcloud.com/jadethegem888"
    },
    {
        platform: "X",
        handle: "@jluhvv",
        url: "https://twitter.com/jluhvv"
    }
];
const FORMSPREE_BOOKING = process.env.NEXT_PUBLIC_FORMSPREE_BOOKING ?? "https://formspree.io/f/YOUR_BOOKING_FORM_ID";
const FORMSPREE_NEWSLETTER = process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER ?? "https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID";
}),
"[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsletterForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/lib/data.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function NewsletterForm({ cta = "Notify Me" }) {
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        const form = e.currentTarget;
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORMSPREE_NEWSLETTER"], {
                method: "POST",
                body: new FormData(form),
                headers: {
                    Accept: "application/json"
                }
            });
            if (res.ok) {
                setStatus("ok");
                form.reset();
            } else {
                setStatus("error");
            }
        } catch  {
            setStatus("error");
        }
    }
    if (status === "ok") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl bg-neon-green/10 border border-neon-green/30 px-6 py-5 text-center text-neon-green font-bold text-sm",
            children: "✓ You're on the list! Watch your inbox. 🔥"
        }, void 0, false, {
            fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                size: 15,
                                className: "absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                name: "email",
                                required: true,
                                placeholder: "Your email address",
                                className: "field pl-10",
                                disabled: status === "loading"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: status === "loading",
                        className: "btn-primary shrink-0 disabled:opacity-60 disabled:cursor-not-allowed",
                        children: status === "loading" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            size: 16,
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
                            lineNumber: 64,
                            columnNumber: 13
                        }, this) : cta
                    }, void 0, false, {
                        fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            status === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-xs text-red-400 text-center",
                children: "Something went wrong — try again or DM @jluhvv"
            }, void 0, false, {
                fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/dj-jade-website/components/NewsletterForm.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
}),
"[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Mail
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Mail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Mail", [
    [
        "rect",
        {
            width: "20",
            height: "16",
            x: "2",
            y: "4",
            rx: "2",
            key: "18n3k1"
        }
    ],
    [
        "path",
        {
            d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
            key: "1ocrg3"
        }
    ]
]);
;
 //# sourceMappingURL=mail.js.map
}),
"[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript)");
}),
"[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoaderCircle
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const LoaderCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("LoaderCircle", [
    [
        "path",
        {
            d: "M21 12a9 9 0 1 1-6.219-8.56",
            key: "13zald"
        }
    ]
]);
;
 //# sourceMappingURL=loader-circle.js.map
}),
"[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$dj$2d$jade$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/dj-jade-website/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=Downloads_dj-jade-website_f3881829._.js.map