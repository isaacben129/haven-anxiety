export default {
  content: [
    './index.html',
    './js/**/*.js'
  ],
  css: [
    './css/haven-anxiety.webflow.shared.0162c8c30.css'
  ],
  output: './css/',
  safelist: [
    // Keep Webflow-specific classes that might be dynamically added
    /^w-/,
    /^w-icon-/,
    /^w-layout-/,
    /^w-node-/,
    /^w-nav-/,
    /^w-button/,
    /^w-inline-block/,
    // Keep animation and transition classes
    /^animate-/,
    /^transition-/,
    // Keep any classes that might be added by JavaScript
    'active',
    'open',
    'show',
    'hide',
    'visible',
    'hidden'
  ],
  defaultExtractor: content => {
    // Custom extractor to handle Webflow's class naming patterns
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
    return broadMatches.concat(innerMatches)
  }
}
