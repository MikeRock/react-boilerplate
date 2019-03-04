/* global __PATH_PREFIX__ */
import PropTypes from 'prop-types'
import React from 'react'
import { Link as RouterLink } from '@reach/router'
// TODO: Add __PATH__PREFIX__ via webpack
export function withPrefix(path) {
  return normalizePath(`${__PATH_PREFIX__}/${path}`)
}

function normalizePath(path) {
  return path.replace(/\/+/g, `/`)
}

const NavLinkPropTypes = {
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object
}

// Set up IntersectionObserver
const handleIntersection = (el, cb) => {
  const io = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (el === entry.target) {
        // Check if element is within viewport, remove listener, destroy observer, and run link callback.
        // MSEdge doesn't currently support isIntersecting, so also test for  an intersectionRatio > 0
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          io.unobserve(el)
          io.disconnect()
          cb()
        }
      }
    })
  })
  // Add element to the observer
  io.observe(el)
}

class Link extends React.Component {
  constructor(props) {
    super(props)
    // Default to no support for IntersectionObserver
    let IOSupported = false
    if (typeof window !== `undefined` && window.IntersectionObserver) {
      IOSupported = true
    }

    this.state = {
      IOSupported
    }
    this.handleRef = this.handleRef.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    // Preserve non IO functionality if no support
    if (this.props.to !== prevProps.to && !this.state.IOSupported) {
      //TODO: Handle case if IO NOT supported
    }
  }

  componentDidMount() {
    // Preserve non IO functionality if no support
    if (!this.state.IOSupported) {
      //TODO: Handle case if IO NOT supported
    }
  }

  handleRef(ref) {
    if (this.props.innerRef) {
      this.props.innerRef(ref)
    }

    if (this.state.IOSupported && ref) {
      // If IO supported and element reference found, setup Observer functionality
      handleIntersection(ref, () => {
        //TODO: Handle case if IO supported and element reference found
      })
    }
  }

  defaultGetProps = ({ isCurrent }) => {
    if (isCurrent) {
      return {
        className: [this.props.className, this.props.activeClassName].filter(Boolean).join(` `),
        style: { ...this.props.style, ...this.props.activeStyle }
      }
    }
    return null
  }

  render() {
    const {
      to,
      getProps = this.defaultGetProps,
      onClick,
      onMouseEnter,
      /* eslint-disable no-unused-vars */
      activeClassName: $activeClassName,
      activeStyle: $activeStyle,
      innerRef: $innerRef,
      state,
      replace,
      /* eslint-enable no-unused-vars */
      ...rest
    } = this.props

    const LOCAL_URL = /^\/(?!\/)/
    if (process.env.NODE_ENV !== `production` && !LOCAL_URL.test(to)) {
      console.warn(
        `External link ${to} was detected in a Link component. Use the Link component only for internal links.`
      )
    }

    const prefixedTo = withPrefix(to)

    return (
      <RouterLink
        to={prefixedTo}
        state={state}
        getProps={getProps}
        innerRef={this.handleRef}
        onMouseEnter={e => {
          if (onMouseEnter) {
            onMouseEnter(e)
          }
          // TODO: Handle case if HOVERED
        }}
        onClick={e => {
          if (onClick) {
            onClick(e)
          }

          if (
            e.button === 0 && // ignore right clicks
            !this.props.target && // let browser handle "target=_blank"
            !e.defaultPrevented && // onClick prevented default
            !e.metaKey && // ignore clicks with modifier keys...
            !e.altKey &&
            !e.ctrlKey &&
            !e.shiftKey
          ) {
            e.preventDefault()

            // Make sure the necessary scripts and data are
            // loaded before continuing.
            navigate(to, { state, replace })
          }

          return true
        }}
        {...rest}
      />
    )
  }
}

Link.propTypes = {
  ...NavLinkPropTypes,
  innerRef: PropTypes.func,
  onClick: PropTypes.func,
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool
}

export default React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)

export const navigate = (to, options) => {
  window.___navigate(withPrefix(to), options)
}

export const push = to => {
  console.warn(`The "push" method is now deprecated and will be removed in Gatsby v3. Please use "navigate" instead.`)
  window.___push(withPrefix(to))
}

export const replace = to => {
  console.warn(
    `The "replace" method is now deprecated and will be removed in Gatsby v3. Please use "navigate" instead.`
  )
  window.___replace(withPrefix(to))
}

export const navigateTo = to => {
  console.warn(
    `The "navigateTo" method is now deprecated and will be removed in Gatsby v3. Please use "navigate" instead.`
  )
  return push(to)
}
