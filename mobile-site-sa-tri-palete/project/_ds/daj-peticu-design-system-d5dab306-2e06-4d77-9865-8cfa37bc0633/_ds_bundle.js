/* @ds-bundle: {"format":4,"namespace":"DesignSystem_d5dab3","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"StarRating","sourcePath":"components/core/StarRating.jsx"},{"name":"Wordmark","sourcePath":"components/core/Wordmark.jsx"},{"name":"Choice","sourcePath":"components/forms/Choice.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"FaqItem","sourcePath":"components/marketing/FaqItem.jsx"},{"name":"FeatureCard","sourcePath":"components/marketing/FeatureCard.jsx"},{"name":"PriceCard","sourcePath":"components/marketing/PriceCard.jsx"},{"name":"SectionHeading","sourcePath":"components/marketing/SectionHeading.jsx"},{"name":"StepItem","sourcePath":"components/marketing/StepItem.jsx"},{"name":"TestimonialCard","sourcePath":"components/marketing/TestimonialCard.jsx"},{"name":"CardMock","sourcePath":"ui_kits/website/CardMock.jsx"},{"name":"Header","sourcePath":"ui_kits/website/Chrome.jsx"},{"name":"Footer","sourcePath":"ui_kits/website/Chrome.jsx"},{"name":"Section","sourcePath":"ui_kits/website/Chrome.jsx"},{"name":"Confirmation","sourcePath":"ui_kits/website/Confirmation.jsx"},{"name":"Home","sourcePath":"ui_kits/website/Home.jsx"},{"name":"Order","sourcePath":"ui_kits/website/Order.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"e5fea4cdaa43","components/core/Button.jsx":"05992b5d57f4","components/core/Card.jsx":"ec1c8aa8ce04","components/core/Icon.jsx":"58e603bb3dcb","components/core/StarRating.jsx":"64c465e042d5","components/core/Wordmark.jsx":"69f7b11ac267","components/forms/Choice.jsx":"b3e098f32493","components/forms/Input.jsx":"491ac8c6a3a3","components/forms/Select.jsx":"ee454ffef628","components/marketing/FaqItem.jsx":"39181770d6a9","components/marketing/FeatureCard.jsx":"bc3137f96b10","components/marketing/PriceCard.jsx":"f0bdfdfff35c","components/marketing/SectionHeading.jsx":"2e1acb935240","components/marketing/StepItem.jsx":"640221405220","components/marketing/TestimonialCard.jsx":"552938d9fc05","ui_kits/website/CardMock.jsx":"c045ea3d5130","ui_kits/website/Chrome.jsx":"72a865e73eeb","ui_kits/website/Confirmation.jsx":"1d4a4aa22710","ui_kits/website/Home.jsx":"fc9ad86583f6","ui_kits/website/Order.jsx":"cb43e12a258e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_d5dab3 = window.DesignSystem_d5dab3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  neutral: {
    background: 'var(--badge-neutral-bg)',
    color: 'var(--badge-neutral-fg)'
  },
  primary: {
    background: 'var(--badge-primary-bg)',
    color: 'var(--badge-primary-fg)'
  },
  solid: {
    background: 'var(--badge-solid-bg)',
    color: 'var(--badge-solid-fg)'
  },
  success: {
    background: 'var(--badge-success-bg)',
    color: 'var(--badge-success-fg)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--primary-on-light)',
    boxShadow: 'inset 0 0 0 1px var(--primary-line)'
  }
};
function Badge({
  tone = 'primary',
  icon,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      minHeight: 'var(--badge-h)',
      padding: '3px var(--badge-px)',
      borderRadius: 'var(--radius-badge)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--badge-fs)',
      fontWeight: 'var(--badge-fw)',
      lineHeight: 1.3,
      ...tones[tone],
      ...style
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--btn-gap)',
  border: 0,
  cursor: 'pointer',
  textDecoration: 'none',
  fontFamily: 'var(--font-sans)',
  fontWeight: 'var(--btn-fw)',
  lineHeight: 1,
  borderRadius: 'var(--radius-button)',
  whiteSpace: 'normal',
  textAlign: 'center',
  transition: 'background var(--dur) var(--ease), box-shadow var(--dur) var(--ease), transform var(--dur-fast) var(--ease), border-color var(--dur) var(--ease)'
};
const sizes = {
  sm: {
    height: 'var(--btn-h-sm)',
    padding: '0 var(--btn-px)',
    fontSize: 'var(--fs-body-sm)',
    minWidth: 0
  },
  md: {
    height: 'var(--btn-h)',
    padding: '0 var(--btn-px)',
    fontSize: 'var(--fs-button)',
    minWidth: 'var(--btn-min-w)'
  },
  lg: {
    height: 'var(--btn-h-lg)',
    padding: '0 var(--btn-px-lg)',
    fontSize: 'var(--fs-button-lg)',
    minWidth: 'var(--btn-min-w)'
  }
};
const variants = {
  primary: {
    background: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-fg)',
    boxShadow: 'var(--btn-primary-shadow)'
  },
  secondary: {
    background: 'var(--btn-secondary-bg)',
    color: 'var(--btn-secondary-fg)',
    border: '1px solid var(--btn-secondary-border)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--btn-outline-fg)',
    border: '2px solid var(--btn-outline-border)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--btn-ghost-fg)'
  }
};
const hovers = {
  primary: {
    background: 'var(--btn-primary-bg-hover)',
    boxShadow: 'var(--btn-primary-shadow-hover)'
  },
  secondary: {
    background: 'var(--btn-secondary-bg-hover)'
  },
  outline: {
    background: 'var(--btn-outline-bg-hover)'
  },
  ghost: {
    background: 'var(--btn-ghost-bg-hover)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  disabled = false,
  iconLeft,
  iconRight,
  href,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(hover && !disabled ? hovers[variant] : null),
    ...(press && !disabled ? {
      transform: 'scale(var(--press-scale))',
      background: variant === 'primary' ? 'var(--btn-primary-bg-active)' : undefined
    } : null),
    ...(full ? {
      width: '100%',
      minWidth: 0
    } : null),
    ...(disabled ? {
      background: 'var(--btn-disabled-bg)',
      color: 'var(--btn-disabled-fg)',
      border: 0,
      boxShadow: 'none',
      cursor: 'not-allowed'
    } : null),
    ...style
  };
  const Tag = href && !disabled ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: s,
    disabled: Tag === 'button' ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  tone = 'default',
  pad = 'md',
  interactive = false,
  as = 'div',
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Tag = as;
  const tones = {
    default: {
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      color: 'var(--text-body)'
    },
    sunken: {
      background: 'var(--surface-sunken)',
      border: '1px solid transparent',
      color: 'var(--text-body)'
    },
    inverse: {
      background: 'var(--card-inverse-bg)',
      border: '1px solid transparent',
      color: 'var(--card-inverse-fg)'
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--border)',
      color: 'var(--text-body)'
    }
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: 'var(--card-radius)',
      padding: pad === 'none' ? 0 : pad === 'lg' ? 'var(--card-p-lg)' : pad === 'sm' ? 'var(--space-4)' : 'var(--card-p)',
      boxShadow: tone === 'default' ? 'var(--card-shadow)' : 'none',
      transition: 'box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease), border-color var(--dur) var(--ease)',
      ...tones[tone],
      ...(interactive && hover ? {
        boxShadow: 'var(--card-shadow-hover)',
        transform: 'translateY(var(--card-lift-hover))',
        borderColor: 'var(--card-border-hover)'
      } : null),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucide icon wrapper. The page must load Lucide once:
 *   <script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js"></script>
 * then call lucide.createIcons() after mount.
 */
function Icon({
  name,
  size = 22,
  stroke = 'currentColor',
  width = 2,
  style,
  ...rest
}) {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("i", _extends({
    "data-lucide": name,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flex: '0 0 auto',
      color: stroke,
      strokeWidth: width,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/StarRating.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PATH = 'M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45L2.6 9.45l6.5-.95z';
function StarRating({
  value = 5,
  max = 5,
  size = 20,
  label,
  gap = 3,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "img",
    "aria-label": label || `${value} od ${max}`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap,
      ...style
    }
  }, rest), Array.from({
    length: max
  }, (_, i) => /*#__PURE__*/React.createElement("svg", {
    key: i,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    style: {
      fill: i < value ? 'var(--star)' : 'var(--surface-3)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: PATH
  }))));
}
Object.assign(__ds_scope, { StarRating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StarRating.jsx", error: String((e && e.message) || e) }); }

// components/core/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Logo slot. There is no mark yet — the brand renders as type. When a mark exists,
 * pass markSrc and the slot fills without any layout change.
 */
function Wordmark({
  context = 'header',
  tone = 'primary',
  markSrc,
  href = '/',
  style,
  ...rest
}) {
  const h = {
    header: 'var(--logo-h-header)',
    headerLg: 'var(--logo-h-header-lg)',
    footer: 'var(--logo-h-footer)',
    hero: 'var(--logo-h-hero)'
  }[context];
  const color = tone === 'inverse' ? 'var(--text-on-inverse)' : tone === 'ink' ? 'var(--text-strong)' : 'var(--primary)';
  const Tag = href ? 'a' : 'span';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    "aria-label": "Daj Peticu",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--logo-gap)',
      height: h,
      maxWidth: 'var(--logo-max-w)',
      textDecoration: 'none',
      padding: 'calc(var(--logo-clear-space) * ' + h + ')',
      boxSizing: 'content-box',
      ...style
    }
  }, rest), markSrc ? /*#__PURE__*/React.createElement("img", {
    src: markSrc,
    alt: "",
    style: {
      height: '100%',
      width: 'auto',
      display: 'block'
    }
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-display-strong)',
      fontSize: `calc(${h} * 0.62)`,
      letterSpacing: '-0.015em',
      lineHeight: 1,
      color,
      whiteSpace: 'nowrap'
    }
  }, "Daj Peticu"));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/forms/Choice.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Choice({
  type = 'checkbox',
  label,
  description,
  checked,
  id,
  boxed = false,
  style,
  ...rest
}) {
  const uid = id || React.useId();
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: description ? 'flex-start' : 'center',
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      minHeight: 'var(--hit-min)',
      ...(boxed ? {
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-field)',
        border: `1px solid ${checked ? 'var(--primary)' : hover ? 'var(--border-strong)' : 'var(--border)'}`,
        background: checked ? 'var(--primary-quiet)' : 'var(--surface-0)',
        transition: 'border-color var(--dur) var(--ease), background var(--dur) var(--ease)'
      } : null),
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: uid,
    type: type,
    checked: checked,
    style: {
      width: 24,
      height: 24,
      flex: '0 0 auto',
      margin: description ? '2px 0 0' : 0,
      accentColor: 'var(--primary)',
      cursor: 'pointer'
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-strong)',
      fontWeight: description ? 'var(--fw-medium)' : 'var(--fw-body)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--lh-snug)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Choice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Choice.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  help,
  error,
  id,
  multiline = false,
  rows = 4,
  prefix,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  const Tag = multiline ? 'textarea' : 'input';
  const border = error ? 'var(--field-border-error)' : focus ? 'var(--field-border-focus)' : 'var(--field-border)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    style: {
      fontSize: 'var(--fs-label)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--field-label-fg)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      background: rest.disabled ? 'var(--field-bg-disabled)' : 'var(--field-bg)',
      border: `1px solid ${border}`,
      borderRadius: 'var(--field-radius)',
      boxShadow: focus ? 'var(--shadow-focus)' : 'var(--field-shadow)',
      padding: '0 var(--field-px)',
      transition: 'border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 'var(--fs-body)'
    }
  }, prefix), /*#__PURE__*/React.createElement(Tag, _extends({
    id: uid,
    rows: multiline ? rows : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 'none',
      background: 'transparent',
      font: 'var(--fs-body)/' + (multiline ? 'var(--lh-body)' : '1') + ' var(--font-sans)',
      color: 'var(--field-fg)',
      height: multiline ? 'auto' : 'calc(var(--field-h) - 2px)',
      padding: multiline ? 'var(--space-3) 0' : 0,
      resize: multiline ? 'vertical' : undefined
    }
  }, rest))), (error || help) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: error ? 'var(--field-error-fg)' : 'var(--field-help-fg)'
    }
  }, error || help));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  help,
  options = [],
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    style: {
      fontSize: 'var(--fs-label)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--field-label-fg)'
    }
  }, label), /*#__PURE__*/React.createElement("select", _extends({
    id: uid,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      height: 'var(--field-h)',
      padding: '0 var(--field-px)',
      appearance: 'none',
      border: `1px solid ${focus ? 'var(--field-border-focus)' : 'var(--field-border)'}`,
      borderRadius: 'var(--field-radius)',
      background: 'var(--field-bg)',
      boxShadow: focus ? 'var(--shadow-focus)' : 'var(--field-shadow)',
      font: 'var(--fs-body)/1 var(--font-sans)',
      color: 'var(--field-fg)',
      backgroundImage: 'linear-gradient(45deg,transparent 50%,var(--ink-500) 50%),linear-gradient(135deg,var(--ink-500) 50%,transparent 50%)',
      backgroundPosition: 'calc(100% - 20px) 50%, calc(100% - 14px) 50%',
      backgroundSize: '6px 6px, 6px 6px',
      backgroundRepeat: 'no-repeat'
    }
  }, rest), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), help && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--field-help-fg)'
    }
  }, help));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FaqItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FaqItem({
  question,
  children,
  defaultOpen = false,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderBottom: '1px solid var(--border-soft)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    style: {
      width: '100%',
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'none',
      border: 0,
      cursor: 'pointer',
      textAlign: 'left',
      padding: 'var(--space-5) 0',
      minHeight: 'var(--hit-min)',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h3)',
      fontWeight: 'var(--fw-display-strong)',
      color: 'var(--text-strong)',
      lineHeight: 'var(--lh-heading)'
    }
  }, question, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: open ? 'minus' : 'plus',
    size: 22,
    stroke: "var(--primary)"
  })), open && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-5)',
      maxWidth: 'var(--measure-prose)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, children));
}
Object.assign(__ds_scope, { FaqItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FaqItem.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FeatureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FeatureCard({
  icon,
  title,
  children,
  tone = 'default',
  style,
  ...rest
}) {
  const inverse = tone === 'inverse';
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    tone: tone,
    pad: "lg",
    interactive: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      background: inverse ? 'rgb(255 255 255/.12)' : 'var(--primary-quiet)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24,
    stroke: inverse ? 'var(--text-on-inverse)' : 'var(--primary)'
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h3)',
      lineHeight: 'var(--lh-heading)',
      fontWeight: 'var(--fw-display-strong)',
      color: inverse ? 'var(--text-on-inverse)' : 'var(--text-strong)',
      textWrap: 'balance'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      lineHeight: 'var(--lh-body)',
      color: inverse ? 'var(--text-quiet-on-inverse)' : 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, children));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PriceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PriceCard({
  name,
  price,
  unit = 'RSD',
  note,
  features = [],
  badge,
  featured = false,
  cta = 'Poruči',
  onSelect,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    pad: "lg",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      ...(featured ? {
        boxShadow: 'var(--shadow-lg)',
        borderColor: 'var(--primary)',
        borderWidth: 2
      } : null),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h3)',
      fontWeight: 'var(--fw-display-strong)',
      color: 'var(--text-strong)'
    }
  }, name), badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: featured ? 'solid' : 'neutral'
  }, badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h1)',
      fontWeight: 'var(--fw-display-strong)',
      color: 'var(--primary)',
      lineHeight: 1
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)'
    }
  }, unit)), note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)',
      marginTop: 'calc(-1 * var(--space-3))'
    }
  }, note), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, features.map(f => /*#__PURE__*/React.createElement("li", {
    key: f,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-snug)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 20,
    stroke: "var(--primary)",
    style: {
      marginTop: 2
    }
  }), f))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: featured ? 'primary' : 'secondary',
    size: "lg",
    full: true,
    onClick: onSelect,
    style: {
      marginTop: 'auto'
    }
  }, cta));
}
Object.assign(__ds_scope, { PriceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PriceCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'light',
  level = 'h2',
  style,
  ...rest
}) {
  const H = level;
  const inverse = tone === 'inverse';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align === 'center' ? 'center' : 'left',
      maxWidth: 'var(--measure-prose)',
      marginInline: align === 'center' ? 'auto' : undefined,
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: inverse ? 'outline' : 'primary',
    style: inverse ? {
      color: 'var(--text-on-inverse)',
      boxShadow: 'inset 0 0 0 1px rgb(255 255 255/.28)'
    } : null
  }, eyebrow), /*#__PURE__*/React.createElement(H, {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: level === 'h1' ? 'var(--fs-display-2)' : 'var(--fs-h1)',
      lineHeight: 'var(--lh-heading)',
      letterSpacing: 'var(--tracking-heading)',
      fontWeight: 'var(--fw-display-strong)',
      color: inverse ? 'var(--text-on-inverse)' : 'var(--text-strong)',
      textWrap: 'balance'
    }
  }, title), lead && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body-lg)',
      lineHeight: 'var(--lh-body)',
      color: inverse ? 'var(--text-quiet-on-inverse)' : 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, lead));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/marketing/StepItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StepItem({
  number,
  title,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-start',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--primary)',
      color: 'var(--text-on-primary)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: '1.25rem',
      fontWeight: 'var(--fw-display-strong)',
      lineHeight: 1
    }
  }, number), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h3)',
      lineHeight: 'var(--lh-heading)',
      fontWeight: 'var(--fw-display-strong)',
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, children)));
}
Object.assign(__ds_scope, { StepItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/StepItem.jsx", error: String((e && e.message) || e) }); }

// components/marketing/TestimonialCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TestimonialCard({
  quote,
  name,
  business,
  city,
  tone = 'default',
  style,
  ...rest
}) {
  const inverse = tone === 'inverse';
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    tone: tone,
    pad: "lg",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    size: 20
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h3)',
      lineHeight: 'var(--lh-snug)',
      color: inverse ? 'var(--text-on-inverse)' : 'var(--text-strong)',
      textWrap: 'pretty'
    }
  }, "\u201E", quote, "\u201C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body-sm)',
      color: inverse ? 'var(--text-quiet-on-inverse)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 'var(--fw-semibold)',
      color: inverse ? 'var(--text-on-inverse)' : 'var(--text-body)'
    }
  }, name), business ? ` — ${business}` : '', city ? `, ${city}` : ''));
}
Object.assign(__ds_scope, { TestimonialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/TestimonialCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/CardMock.jsx
try { (() => {
/** The physical product rendered from brand elements only — no photography was provided. */
function CardMock({
  width = 320,
  tone = 'ink',
  tilt = -6,
  style
}) {
  const dark = tone === 'ink';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      aspectRatio: '1.586',
      borderRadius: 'var(--radius-md)',
      background: dark ? 'var(--bg-inverse)' : 'var(--surface-0)',
      border: dark ? '1px solid rgb(255 255 255/.10)' : '1px solid var(--border)',
      boxShadow: 'var(--shadow-lg)',
      transform: `rotate(${tilt}deg)`,
      padding: 'clamp(14px, 6%, 24px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-display-strong)',
      fontSize: width * 0.062,
      letterSpacing: '-.015em',
      color: dark ? '#fff' : 'var(--primary)'
    }
  }, "Daj Peticu"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: width * 0.09,
      height: width * 0.09,
      borderRadius: 6,
      display: 'grid',
      placeItems: 'center',
      background: dark ? 'rgb(255 255 255/.12)' : 'var(--primary-quiet)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "nfc",
    style: {
      width: width * 0.055,
      height: width * 0.055,
      color: dark ? '#fff' : 'var(--primary)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: width * 0.022
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    size: width * 0.075
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: width * 0.052,
      color: dark ? '#fff' : 'var(--text-strong)'
    }
  }, "Prisloni telefon"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: width * 0.04,
      color: dark ? 'var(--text-quiet-on-inverse)' : 'var(--text-muted)'
    }
  }, "i ostavi recenziju")));
}
Object.assign(__ds_scope, { CardMock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CardMock.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Chrome.jsx
try { (() => {
const NAV = [['kako', 'Kako radi'], ['cijene', 'Cijene'], ['iskustva', 'Iskustva'], ['pitanja', 'Pitanja']];
function Header({
  onOrder,
  onNav
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgb(255 255 255/.88)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '10px var(--gutter)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    context: "header",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav && onNav('top');
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dp-desktop-nav",
    style: {
      display: 'flex',
      gap: 'var(--space-1)'
    }
  }, NAV.map(([id, label]) => /*#__PURE__*/React.createElement(__ds_scope.Button, {
    key: id,
    variant: "ghost",
    size: "sm",
    onClick: () => onNav && onNav(id)
  }, label))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onOrder
  }, "Poru\u010Di"), /*#__PURE__*/React.createElement("button", {
    className: "dp-burger",
    "aria-label": "Meni",
    onClick: () => setOpen(o => !o),
    style: {
      display: 'none',
      width: 48,
      height: 48,
      border: 0,
      background: 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: open ? 'x' : 'menu',
    size: 26,
    stroke: "var(--ink-800)"
  })))), open && /*#__PURE__*/React.createElement("div", {
    className: "dp-mobile-nav",
    style: {
      borderTop: '1px solid var(--border-soft)',
      padding: 'var(--space-3) var(--gutter)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      background: 'var(--surface-0)'
    }
  }, NAV.map(([id, label]) => /*#__PURE__*/React.createElement(__ds_scope.Button, {
    key: id,
    variant: "ghost",
    full: true,
    style: {
      justifyContent: 'flex-start'
    },
    onClick: () => {
      setOpen(false);
      onNav && onNav(id);
    }
  }, label))));
}
function Footer({
  onOrder
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--bg-inverse)',
      color: 'var(--text-on-inverse)',
      padding: 'var(--space-16) var(--gutter) var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-12)',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      maxWidth: '34ch'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    context: "footer",
    tone: "inverse"
  }), /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    size: 20
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--fs-body-sm)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-quiet-on-inverse)'
    }
  }, "Kartice tamo gde mu\u0161terija pla\u0107a. Jedan tap \u2014 i recenzija je gotova.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      fontSize: 'var(--fs-body-sm)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 'var(--fw-semibold)'
    }
  }, "Kontakt"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+381601234567",
    style: {
      color: 'var(--text-quiet-on-inverse)',
      textDecoration: 'none'
    }
  }, "+381 60 123 4567"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:zdravo@dajpeticu.rs",
    style: {
      color: 'var(--text-quiet-on-inverse)',
      textDecoration: 'none'
    }
  }, "zdravo@dajpeticu.rs"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-quiet-on-inverse)'
    }
  }, "Instagram \xB7 Viber")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--fs-body-sm)'
    }
  }, "Poru\u010Di za 1 minut"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    onClick: onOrder,
    iconRight: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "arrow-right",
      size: 20
    })
  }, "Poru\u010Di karticu"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: 'var(--space-10) auto 0',
      paddingTop: 'var(--space-5)',
      borderTop: '1px solid rgb(255 255 255/.14)',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-quiet-on-inverse)'
    }
  }, "\xA9 2026 Daj Peticu \xB7 Uslovi \xB7 Privatnost"));
}
function Section({
  id,
  tone = 'light',
  children,
  style
}) {
  const bg = {
    light: 'var(--surface-0)',
    alt: 'var(--surface-1)',
    sunken: 'var(--surface-2)',
    inverse: 'var(--bg-inverse)'
  }[tone];
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: {
      background: bg,
      padding: 'var(--section-y) var(--gutter)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)'
    }
  }, children));
}
Object.assign(__ds_scope, { Header, Footer, Section });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Confirmation.jsx
try { (() => {
function Confirmation({
  plan,
  onHome
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-1)',
      padding: 'var(--section-y) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-narrow)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 76,
      height: 76,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--primary)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 38,
    stroke: "#fff"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-display-2)',
      lineHeight: 'var(--lh-display)',
      fontWeight: 'var(--fw-display-strong)',
      color: 'var(--text-strong)',
      textWrap: 'balance'
    }
  }, "Primili smo porud\u017Ebinu"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--fs-body-lg)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-body)',
      maxWidth: 'var(--measure-narrow)'
    }
  }, plan ? plan.label : 'Kartica', " sti\u017Ee po\u0161tom za dva radna dana. Zovemo vas samo ako nam ne\u0161to nije jasno."), /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    size: 26
  }), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    pad: "lg",
    style: {
      width: '100%',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StepItem, {
    number: "1",
    title: "Pode\u0161avamo karticu"
  }, "Danas povezujemo karticu sa va\u0161im Google profilom."), /*#__PURE__*/React.createElement(__ds_scope.StepItem, {
    number: "2",
    title: "Paket kre\u0107e"
  }, "Dobijate SMS sa brojem za pra\u0107enje."), /*#__PURE__*/React.createElement(__ds_scope.StepItem, {
    number: "3",
    title: "Stavite je na kasu"
  }, "Prvi tap obi\u010Dno stigne isti dan.")), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "lg",
    onClick: onHome,
    iconLeft: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "arrow-left",
      size: 20
    })
  }, "Vrati se na po\u010Detnu")));
}
Object.assign(__ds_scope, { Confirmation });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Confirmation.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
const grid3 = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
  gap: 'var(--space-5)',
  alignItems: 'stretch'
};
function Home({
  onOrder
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Section, {
    id: "top",
    tone: "light",
    style: {
      paddingBottom: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 'var(--space-12)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      maxWidth: '46ch'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, null, "Sti\u017Ee po\u0161tom za 2 dana"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-display-2)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--tracking-display)',
      fontWeight: 'var(--fw-display-strong)',
      color: 'var(--text-strong)',
      textWrap: 'balance'
    }
  }, "Konkurencija nije bolja od vas. Samo ima ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--primary)'
    }
  }, "vi\u0161e recenzija"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "preko 400 kartica u Srbiji")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--fs-body-lg)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-body)',
      maxWidth: 'var(--measure-prose)',
      textWrap: 'pretty'
    }
  }, "Kartica stoji tamo gde mu\u0161terija pla\u0107a. Jedan tap telefonom \u2014 i recenzija je gotova. Bez aplikacije, bez struje, bez mjese\u010Dne pretplate."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "lg",
    onClick: onOrder,
    iconRight: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "arrow-right",
      size: 22
    })
  }, "Poru\u010Di karticu"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "lg",
    variant: "outline",
    href: "#kako"
  }, "Kako radi?")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      flexWrap: 'wrap',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-muted)'
    }
  }, [['truck', 'Isporuka uključena'], ['shield-check', 'Zamjena 30 dana'], ['banknote', 'Plaćanje pouzećem']].map(([i, t]) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: i,
    size: 20,
    stroke: "var(--primary)"
  }), t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      minHeight: 340,
      background: 'radial-gradient(60% 60% at 50% 45%, var(--primary-quiet) 0%, transparent 70%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.CardMock, {
    width: 300,
    tone: "light",
    tilt: 7,
    style: {
      position: 'absolute',
      translate: '-26px 22px'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.CardMock, {
    width: 320,
    tone: "ink",
    tilt: -6
  }))))), /*#__PURE__*/React.createElement(__ds_scope.Section, {
    id: "zasto",
    tone: "alt"
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "Za\u0161to kartica",
    title: "Recenzije ne sti\u017Eu same. Treba ih pitati u pravom trenutku.",
    lead: "Mu\u0161terija je najzadovoljnija dok pla\u0107a. Tada je kartica pred njom.",
    align: "center"
  }), /*#__PURE__*/React.createElement("div", {
    style: grid3
  }, /*#__PURE__*/React.createElement(__ds_scope.FeatureCard, {
    icon: "nfc",
    title: "Jedan tap"
  }, "Mu\u0161terija prisloni telefon na karticu i va\u0161 Google profil se sam otvori."), /*#__PURE__*/React.createElement(__ds_scope.FeatureCard, {
    icon: "zap-off",
    title: "Bez struje i WiFi-a"
  }, "Kartica ne treba punjenje ni internet. Radi i za deset godina."), /*#__PURE__*/React.createElement(__ds_scope.FeatureCard, {
    icon: "badge-percent",
    title: "Bez pretplate"
  }, "Platite karticu jednom. Nema mjese\u010Dnih tro\u0161kova."))), /*#__PURE__*/React.createElement(__ds_scope.Section, {
    id: "kako",
    tone: "light"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 'var(--space-12)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "Kako radi",
    title: "Tri koraka i gotovo"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StepItem, {
    number: "1",
    title: "Poru\u010Dite karticu"
  }, "Popunite ime objekta i adresu. Traje minut, bez ugovora."), /*#__PURE__*/React.createElement(__ds_scope.StepItem, {
    number: "2",
    title: "Mi je podesimo"
  }, "Pove\u017Eemo karticu sa va\u0161im Google profilom i po\u0161aljemo je po\u0161tom."), /*#__PURE__*/React.createElement(__ds_scope.StepItem, {
    number: "3",
    title: "Stavite je na kasu"
  }, "Prvi tap obi\u010Dno stigne isti dan. Vi ne radite ni\u0161ta."))), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    tone: "sunken",
    pad: "lg",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-eyebrow)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--primary)'
    }
  }, "\u0160ta mu\u0161terija vidi"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-0)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-soft)',
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-2)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "store",
    size: 22,
    stroke: "var(--ink-700)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-strong)'
    }
  }, "Kafi\u0107 Zora"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, "Novi Sad"))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)'
    }
  }, "Kako vam je bilo kod nas?"), /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    size: 34,
    gap: 6
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    full: true
  }, "Po\u0161alji recenziju")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, "Ovo je prikaz Google forme koju mu\u0161terija dobije \u2014 nije na\u0161 ekran.")))), /*#__PURE__*/React.createElement(__ds_scope.Section, {
    id: "iskustva",
    tone: "inverse"
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    tone: "inverse",
    eyebrow: "Iskustva",
    title: "Ljudi koji su je stavili na kasu",
    align: "center"
  }), /*#__PURE__*/React.createElement("div", {
    style: grid3
  }, /*#__PURE__*/React.createElement(__ds_scope.TestimonialCard, {
    tone: "inverse",
    style: {
      background: 'rgb(255 255 255/.07)'
    },
    quote: "Za dvije nedjelje 34 nove recenzije. Nisam morao nikoga da molim.",
    name: "Milan",
    business: "Kafi\u0107 Zora",
    city: "Novi Sad"
  }), /*#__PURE__*/React.createElement(__ds_scope.TestimonialCard, {
    tone: "inverse",
    style: {
      background: 'rgb(255 255 255/.07)'
    },
    quote: "Mu\u0161terije se same nasmiju kad vide da radi. Djevojke na recepciji je zovu \u010Darobna.",
    name: "Jelena",
    business: "Salon \u0160e\u0107er",
    city: "\u010Ca\u010Dak"
  }), /*#__PURE__*/React.createElement(__ds_scope.TestimonialCard, {
    tone: "inverse",
    style: {
      background: 'rgb(255 255 255/.07)'
    },
    quote: "Bili smo 4,2. Sada 4,7 i zovu nas iz Beograda.",
    name: "\u0110or\u0111e",
    business: "Restoran Lipa",
    city: "Kragujevac"
  }))), /*#__PURE__*/React.createElement(__ds_scope.Section, {
    id: "cijene",
    tone: "alt"
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "Cijene",
    title: "Platite jednom. Kartica radi godinama.",
    lead: "Isporuka je uklju\u010Dena u cijenu. Pla\u0107ate pouze\u0107em, kada paket stigne.",
    align: "center"
  }), /*#__PURE__*/React.createElement("div", {
    style: grid3
  }, /*#__PURE__*/React.createElement(__ds_scope.PriceCard, {
    name: "1 kartica",
    price: "1 990",
    note: "Za jedno mjesto naplate.",
    features: ['Podešeno unaprijed', 'Vaš Google profil', 'Isporuka uključena'],
    cta: "Poru\u010Di 1 karticu",
    onSelect: onOrder
  }), /*#__PURE__*/React.createElement(__ds_scope.PriceCard, {
    featured: true,
    badge: "Naj\u010De\u0161\u0107e poru\u010Duju",
    name: "3 kartice",
    price: "4 490",
    note: "Kasa, \u0161ank i stol.",
    features: ['Podešeno unaprijed', 'Vaš Google profil', 'Isporuka uključena', 'Zamjena bez pitanja 30 dana'],
    cta: "Poru\u010Di 3 kartice",
    onSelect: onOrder
  }), /*#__PURE__*/React.createElement(__ds_scope.PriceCard, {
    name: "10 kartica",
    price: "12 900",
    note: "Za lance i ve\u0107e objekte.",
    features: ['Sve iz paketa od 3', 'Vaš logo na kartici', 'Prioritetna isporuka'],
    cta: "Poru\u010Di 10 kartica",
    onSelect: onOrder
  }))), /*#__PURE__*/React.createElement(__ds_scope.Section, {
    id: "pitanja",
    tone: "light"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 'var(--space-12)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "\u010Cesta pitanja",
    title: "Ono \u0161to nas naj\u010De\u0161\u0107e pitaju",
    lead: "Ako ne\u0161to nije jasno, pozovite nas \u2014 javlja se \u010Dovjek, ne robot."
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.FaqItem, {
    defaultOpen: true,
    question: "Treba li mu\u0161teriji aplikacija?"
  }, "Ne. Skoro svi telefoni od 2018. naovamo sami prepoznaju karticu. Za starije telefone na kartici je i QR kod."), /*#__PURE__*/React.createElement(__ds_scope.FaqItem, {
    question: "\u0160ta ako se kartica o\u0161teti?"
  }, "Po\u0161aljemo novu, bez pitanja, u prvih 30 dana."), /*#__PURE__*/React.createElement(__ds_scope.FaqItem, {
    question: "Da li Google zabranjuje ovo?"
  }, "Ne. Vi samo olak\u0161avate mu\u0161teriji da ostavi recenziju. Ne kupujete recenzije i ne filtrirate ih."), /*#__PURE__*/React.createElement(__ds_scope.FaqItem, {
    question: "Kako se pla\u0107a?"
  }, "Pouze\u0107em, kada paket stigne. Ra\u010Dun na firmu \u0161aljemo na e-mail."), /*#__PURE__*/React.createElement(__ds_scope.FaqItem, {
    question: "Radi li za vi\u0161e lokacija?"
  }, "Radi. Svaka kartica se pode\u0161ava na svoj Google profil.")))), /*#__PURE__*/React.createElement(__ds_scope.Section, {
    tone: "alt",
    style: {
      paddingTop: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Card, {
    pad: "lg",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-6)',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: 'var(--primary-line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      maxWidth: '40ch'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    size: 22
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h2)',
      fontWeight: 'var(--fw-display-strong)',
      color: 'var(--text-strong)',
      lineHeight: 'var(--lh-heading)'
    }
  }, "Poru\u010Di za 1 minut, sti\u017Ee po\u0161tom")), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "lg",
    onClick: onOrder,
    iconRight: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "arrow-right",
      size: 22
    })
  }, "Poru\u010Di karticu"))));
}
Object.assign(__ds_scope, { Home });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Order.jsx
try { (() => {
const PLANS = [{
  id: '1',
  label: '1 kartica',
  price: '1 990',
  desc: 'Za jedno mjesto naplate.'
}, {
  id: '3',
  label: '3 kartice',
  price: '4 490',
  desc: 'Kasa, šank i stol.'
}, {
  id: '10',
  label: '10 kartica',
  price: '12 900',
  desc: 'Za lance i veće objekte.'
}];
function Order({
  onDone,
  onBack
}) {
  const [plan, setPlan] = React.useState('3');
  const [terms, setTerms] = React.useState(false);
  const [name, setName] = React.useState('');
  const [tried, setTried] = React.useState(false);
  const chosen = PLANS.find(p => p.id === plan);
  const submit = () => {
    setTried(true);
    if (name.trim() && terms) onDone(chosen);
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-1)',
      padding: 'var(--space-10) var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    onClick: onBack,
    iconLeft: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "arrow-left",
      size: 20
    }),
    style: {
      alignSelf: 'flex-start'
    }
  }, "Nazad"), /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "Poru\u010Di",
    title: "Popunite i to je sve",
    lead: "Pla\u0107ate pouze\u0107em kada paket stigne. Nema ugovora ni pretplate."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 'var(--space-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 'var(--fs-label)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, "Koliko kartica?"), PLANS.map(p => /*#__PURE__*/React.createElement(__ds_scope.Choice, {
    key: p.id,
    type: "radio",
    name: "plan",
    boxed: true,
    checked: plan === p.id,
    onChange: () => setPlan(p.id),
    label: `${p.label} — ${p.price} RSD`,
    description: p.desc
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Naziv objekta",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "npr. Frizerski salon \u0160e\u0107er",
    error: tried && !name.trim() ? 'Unesite naziv objekta.' : undefined
  }), /*#__PURE__*/React.createElement(__ds_scope.Select, {
    label: "Tip objekta",
    options: ['Kafić', 'Restoran', 'Frizerski salon', 'Ordinacija', 'Auto-perionica', 'Drugo']
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Ime i prezime",
    placeholder: "Milan Petrovi\u0107"
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Telefon",
    prefix: "+381",
    placeholder: "60 123 4567",
    help: "Zovemo samo ako ne\u0161to nije jasno."
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Adresa za dostavu",
    placeholder: "Ulica i broj, grad, po\u0161tanski broj",
    multiline: true,
    rows: 3
  }), /*#__PURE__*/React.createElement(__ds_scope.Choice, {
    checked: terms,
    onChange: e => setTerms(e.target.checked),
    label: "Sla\u017Eem se sa uslovima kori\u0161\u0107enja"
  }), tried && !terms && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--danger)'
    }
  }, "Potrebno je prihvatiti uslove."))), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    pad: "lg",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      position: 'sticky',
      top: 90
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h3)',
      fontWeight: 'var(--fw-display-strong)',
      color: 'var(--text-strong)'
    }
  }, "Va\u0161a porud\u017Ebina"), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral"
  }, "Pouze\u0107em")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: 'var(--space-4) 0'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.CardMock, {
    width: 220,
    tilt: -5
  })), [[chosen.label, chosen.price + ' RSD'], ['Isporuka', 'uključena'], ['Podešavanje', 'uključeno']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-soft)',
      paddingTop: 'var(--space-4)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-muted)'
    }
  }, "Ukupno"), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-h1)',
      color: 'var(--primary)',
      fontWeight: 'var(--fw-display-strong)',
      lineHeight: 1
    }
  }, chosen.price)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "lg",
    full: true,
    onClick: submit
  }, "Poru\u010Di ", chosen.label.toLowerCase()), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 8,
      alignItems: 'center',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "shield-check",
    size: 18,
    stroke: "var(--primary)"
  }), "Zamjena bez pitanja u prvih 30 dana."), /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    size: 18
  })))));
}
Object.assign(__ds_scope, { Order });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Order.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.StarRating = __ds_scope.StarRating;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Choice = __ds_scope.Choice;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.FaqItem = __ds_scope.FaqItem;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.PriceCard = __ds_scope.PriceCard;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.StepItem = __ds_scope.StepItem;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.CardMock = __ds_scope.CardMock;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Section = __ds_scope.Section;

__ds_ns.Confirmation = __ds_scope.Confirmation;

__ds_ns.Home = __ds_scope.Home;

__ds_ns.Order = __ds_scope.Order;

})();
