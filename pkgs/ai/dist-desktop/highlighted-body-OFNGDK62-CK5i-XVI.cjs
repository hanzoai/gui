'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index-BqtStGzd.cjs');
const React = require('react');
const jsxRuntime = require('react/jsx-runtime');

var R=({code:s,language:e,raw:t,className:h,startLine:d,lineNumbers:m,...p})=>{let{shikiTheme:l}=React.useContext(index.R),o=index.Li(),[a,i]=React.useState(t);return React.useEffect(()=>{if(!o){i(t);return}let r=o.highlight({code:s,language:e,themes:l},c=>{i(c);});r&&i(r);},[s,e,l,o,t]),jsxRuntime.jsx(index.At,{className:h,language:e,lineNumbers:m,result:a,startLine:d,...p})};

exports.HighlightedCodeBlockBody = R;
