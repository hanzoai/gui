import { R as R$1, L as Li, A as At } from './index-1Lq5jK-k.js';
import { useContext, useState, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';

var R=({code:s,language:e,raw:t,className:h,startLine:d,lineNumbers:m,...p})=>{let{shikiTheme:l}=useContext(R$1),o=Li(),[a,i]=useState(t);return useEffect(()=>{if(!o){i(t);return}let r=o.highlight({code:s,language:e,themes:l},c=>{i(c);});r&&i(r);},[s,e,l,o,t]),jsx(At,{className:h,language:e,lineNumbers:m,result:a,startLine:d,...p})};

export { R as HighlightedCodeBlockBody };
