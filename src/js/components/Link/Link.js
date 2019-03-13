import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { NavLink as RouterLink } from 'react-router'
import prefetch from './../../../../helpers/prefetch'

export const withPrefix = path => normalizePath(`${process.env.PATH_PREFIX}/${path}`)

// Normalize path
function normalizePath(path) {
  return path.replace(/\/+/g, `/`)
}
// Detect slow networks
function isSlowOrOffline() {
  if (`connection` in navigator && (navigator.connection.effectiveType || ``).includes(`2g`)) {
    return true
  }
  if (`connection` in navigator && navigator.connection.saveData) {
    return true
  }
  if (navigator.onLine) return true
  return false
}

const NavLinkPropTypes = {
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  innerRef: PropTypes.func,
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool
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

class Link extends Component {
  static propTypes = {
    ...NavLinkPropTypes,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    prefetch: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
  }

  constructor(...args) {
    super(...args)
    // Default to no support for IntersectionObserver
    let IOSupported = false
    if (typeof window !== `undefined` && window.IntersectionObserver) {
      IOSupported = true
    }
    this.state = {
      IOSupported
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Preserve non IO functionality if no support
    if (this.props.to !== prevProps.to && !this.state.IOSupported) {
      // TODO: Handle case if IO NOT supported
      //  !isSlowOrOffline && prefetch(this.props.to)
    }
  }

  componentDidMount() {
    // Preserve non IO functionality if no support
    if (!this.state.IOSupported) {
      // TODO: Handle case if IO NOT supported ->  lazy load pollyfill?
    }
  }

  handleRef = ref => {
    if (this.props.innerRef) {
      this.props.innerRef(ref)
    }

    if (this.state.IOSupported && ref) {
      // If IO supported and element reference found, setup Observer functionality
      handleIntersection(ref, () => {
        // TODO: Handle case if IO supported and element reference found
        // !isSlowOrOffline  && prefetch(this.props.to)
      })
    }
  }

  render() {
    const {
      to: path,
      onClick,
      onMouseEnter,
      /* eslint-disable no-unused-vars */
      activeClassName,
      activeStyle,
      state,
      replace,
      /* eslint-enable no-unused-vars */
      ...rest
    } = this.props

    const LOCAL_URL = /^\/(?!\/)/
    if (/production/.test(process.env.NODE_ENV) && !LOCAL_URL.test(path)) {
      console.warn(
        `External link ${path} was detected in a Link component. Use the Link component only for internal links.`
      )
    }

    return (
      <RouterLink
        activeClassName={activeClassName}
        activeStyle={activeStyle}
        to={{
          path: path,
          state
        }}
        innerRef={this.handleRef}
        onMouseEnter={e => {
          onMouseEnter && onMouseEnter(e)
          // Skip prefetching if we know user is on slow or constrained connection

          //  !isSlowOrOffline && prefetch(path)
        }}
        onClick={e => {
          onClick && onClick(e)

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
          }

          return true
        }}
        {...rest}
      />
    )
  }
}
// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)
