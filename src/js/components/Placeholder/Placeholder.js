import React from 'react'
import ContentLoader from 'react-content-loader'
import logo from '!!url-loader?limit=1!assets:img/favicon_transparent.png'
import { relative } from 'path'

const Article = ({ width, height, ...rest }) => (
  <ContentLoader height={550} width={1000} speed={3} primaryColor="#f7eee6" secondaryColor="#fff8f2" {...rest}>
    <rect x="0" y="405" rx="3" ry="3" width="95%" height="55" />
    <rect x="0" y="470" rx="3" ry="3" width="70%" height="55" />
    <rect x="0" y="12.67" rx="0" ry="0" width="100%" height="350" />
    <rect x="154" y="80.67" rx="0" ry="0" width="0" height="0" />
    <rect x="153" y="83.67" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
)
const Image = ({ width, height, ...rest }) => (
  <div style={{ position: 'relative' }}>
    <ContentLoader height={600} width={1000} speed={3} primaryColor="#f7eee6" secondaryColor="#fff8f2" {...rest}>
      <rect x="10" y="530" rx="3" ry="3" width="80%" height="65" />
      <rect x="0" y="0" rx="0" ry="0" width="100%" height="500" />
      <rect x="154" y="80" rx="0" ry="0" width="0" height="0" />
      <rect x="153" y="80" rx="0" ry="0" width="0" height="0" />
    </ContentLoader>
    <div
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        width: 200,
        height: 200,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-70%)',
        position: 'absolute'
      }}
    />
  </div>
)
const ArticleContent = ({ width, height, ...rest }) => (
  <ContentLoader height={800} width={1000} speed={3} primaryColor="#f7eee6" secondaryColor="#fff8f2" {...rest}>
    <rect x="0" y="0" rx="0" ry="0" width="80%" height="85" />
    <rect x="0" y="120" rx="0" ry="0" width="60%" height="65" />
    <rect x="0" y="200" rx="0" ry="0" width="75%" height="65" />
    <rect x="0" y="300" rx="0" ry="0" width="80%" height="25" />
    <rect x="0" y="350" rx="0" ry="0" width="75%" height="25" />
    <rect x="0" y="380" rx="0" ry="0" width="78%" height="25" />
    <rect x="0" y="410" rx="0" ry="0" width="65%" height="25" />
    <rect x="154" y="80" rx="0" ry="0" width="0" height="0" />
    <rect x="153" y="80" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
)
export default { Article, Image, ArticleContent }
