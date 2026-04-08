(function () {
  const APP_PACKAGE = "com.rotrxitsolution.khatasetu";
  const APP_SCHEME = "khatasetu";
  const APP_ENTRY = "open";
  const PLAY_STORE_BASE_URL =
    "https://play.google.com/store/apps/details?id=com.rotrxitsolution.khatasetu";
  const AUTO_FALLBACK_DELAY_MS = 1800;

  const ROUTES = {
    ledger: {
      screen: "ledger",
      title: "Opening your ledger...",
      description:
        "If KhataSetu is installed, this link will open the selected ledger. Otherwise we will take you to Google Play.",
      required: [
        {
          key: "lid",
          label: "ledger id",
          aliases: ["lid", "ledgerId", "ledger_id"],
        },
      ],
      optional: [
        {
          key: "tk",
          aliases: ["tk", "token"],
        },
        {
          key: "ref",
          aliases: ["ref", "code", "referral", "referralCode", "referral_code"],
        },
      ],
      summary(values) {
        const parts = [`Ledger ID: ${values.lid}`];

        if (values.tk) {
          parts.push(`Token: ${maskValue(values.tk)}`);
        }

        if (values.ref) {
          parts.push(`Referral: ${values.ref}`);
        }

        return parts.join(" | ");
      },
    },
    referral: {
      screen: "signup",
      title: "Opening KhataSetu signup...",
      description:
        "If KhataSetu is installed, this link will open signup with the referral code already filled in. Otherwise we will take you to Google Play.",
      required: [
        {
          key: "ref",
          label: "referral code",
          aliases: ["ref", "code", "referral", "referralCode", "referral_code"],
        },
      ],
      optional: [],
      summary(values) {
        return `Referral code: ${values.ref}`;
      },
    },
  };

  function getRoute() {
    const kind = document.body.dataset.linkKind;
    return ROUTES[kind] || null;
  }

  function getElement(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const el = getElement(id);
    if (el) {
      el.textContent = value;
    }
  }

  function setLink(id, href, label) {
    const el = getElement(id);

    if (!el) {
      return;
    }

    el.href = href;

    if (label) {
      el.textContent = label;
    }
  }

  function getFirstQueryValue(searchParams, aliases) {
    for (const alias of aliases) {
      const value = (searchParams.get(alias) || "").trim();

      if (value) {
        return value;
      }
    }

    return "";
  }

  function collectRouteValues(route) {
    const searchParams = new URLSearchParams(window.location.search);
    const values = {};
    const missing = [];

    for (const field of route.required) {
      const value = getFirstQueryValue(searchParams, field.aliases);

      if (!value) {
        missing.push(field.label);
        continue;
      }

      values[field.key] = value;
    }

    for (const field of route.optional) {
      const value = getFirstQueryValue(searchParams, field.aliases);

      if (value) {
        values[field.key] = value;
      }
    }

    return { values, missing };
  }

  function maskValue(value) {
    if (value.length <= 8) {
      return value;
    }

    return `${value.slice(0, 4)}...${value.slice(-4)}`;
  }

  function buildAppQuery(screen, values) {
    return new URLSearchParams({
      screen,
      ...values,
    }).toString();
  }

  function buildAppUrl(screen, values) {
    return `${APP_SCHEME}://${APP_ENTRY}?${buildAppQuery(screen, values)}`;
  }

  function buildPlayStoreUrl(screen, values) {
    const url = new URL(PLAY_STORE_BASE_URL);
    const referrer = new URLSearchParams({
      screen,
      ...values,
    });

    url.searchParams.set("referrer", referrer.toString());

    return url.toString();
  }

  function buildIntentUrl(screen, values, playStoreUrl) {
    return `intent://${APP_ENTRY}?${buildAppQuery(
      screen,
      values
    )}#Intent;scheme=${APP_SCHEME};package=${APP_PACKAGE};S.browser_fallback_url=${encodeURIComponent(
      playStoreUrl
    )};end`;
  }

  function isAndroid() {
    return /Android/i.test(window.navigator.userAgent || "");
  }

  function renderInvalidLink(missing) {
    setText("deepLinkTitle", "This shared link is incomplete");
    setText(
      "deepLinkDescription",
      `We could not find the ${missing.join(
        " and "
      )} in the URL. Please create a new shared link from the app.`
    );
    setText("deepLinkSummaryValue", `Missing: ${missing.join(", ")}`);
    setText(
      "deepLinkHint",
      "You can still install the app from Google Play and create a fresh share link."
    );
    setLink("openAppButton", PLAY_STORE_BASE_URL, "Install from Google Play");
    setLink("installAppButton", "/", "Go to khatasetu.com");
  }

  function startLaunchFlow(intentUrl, playStoreUrl) {
    let completed = false;
    let fallbackTimer = null;

    const finish = function () {
      if (completed) {
        return;
      }

      completed = true;

      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }

      window.removeEventListener("pagehide", finish);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    const handleVisibilityChange = function () {
      if (document.visibilityState === "hidden") {
        finish();
      }
    };

    window.addEventListener("pagehide", finish);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    fallbackTimer = window.setTimeout(function () {
      if (completed) {
        return;
      }

      window.location.replace(playStoreUrl);
    }, AUTO_FALLBACK_DELAY_MS);

    window.setTimeout(function () {
      window.location.replace(intentUrl);
    }, 120);
  }

  function init() {
    const route = getRoute();

    if (!route) {
      return;
    }

    const { values, missing } = collectRouteValues(route);

    setText("deepLinkTitle", route.title);
    setText("deepLinkDescription", route.description);

    if (missing.length) {
      renderInvalidLink(missing);
      return;
    }

    const playStoreUrl = buildPlayStoreUrl(route.screen, values);
    const appUrl = buildAppUrl(route.screen, values);
    const intentUrl = buildIntentUrl(route.screen, values, playStoreUrl);
    const openUrl = isAndroid() ? intentUrl : appUrl;

    setText("deepLinkSummaryValue", route.summary(values));
    setText(
      "deepLinkHint",
      "If nothing happens, tap Open KhataSetu. If the app is not installed, use the Google Play button."
    );
    setLink("openAppButton", openUrl, "Open KhataSetu");
    setLink("installAppButton", playStoreUrl, "Install from Google Play");

    if (isAndroid()) {
      startLaunchFlow(intentUrl, playStoreUrl);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
