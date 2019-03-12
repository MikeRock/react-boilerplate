import React from 'react'
import ContentLoader from 'react-content-loader'
const Article = ({ width, height, ...rest }) => (
  <ContentLoader height={550} width={1000} speed={2} primaryColor="#f4e6d9" secondaryColor="#fff8f2" {...rest}>
    <rect x="0" y="405" rx="3" ry="3" width="90%" height="45" />
    <rect x="0" y="470" rx="3" ry="3" width="80%" height="45" />
    <rect x="0" y="12.67" rx="0" ry="0" width="100%" height="350" />
    <rect x="154" y="80.67" rx="0" ry="0" width="0" height="0" />
    <rect x="153" y="83.67" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
)
const Image = ({ width, height, ...rest }) => (
  <ContentLoader height={550} width={1000} speed={2} primaryColor="#f4e6d9" secondaryColor="#fff8f2" {...rest}>
    <rect x="0" y="455" rx="3" ry="3" width="90%" height="65" />
    <rect x="0" y="10" rx="0" ry="0" width="100%" height="450" />
    <rect x="154" y="80" rx="0" ry="0" width="0" height="0" />
    <rect x="153" y="80" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
)
export default { Article, Image }
