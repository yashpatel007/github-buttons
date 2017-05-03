// Generated by CoffeeScript 1.12.5
(function() {
  var BASEURL, BUTTON_CLASS, GITHUB_API_BASEURL, ICON_CLASS, ICON_CLASS_DEFAULT, Math, UUID, ceilPixel, createAnchor, createElement, createTextNode, decodeURIComponent, defer, document, encodeURIComponent, getFrameContentSize, jsonp, onEvent, onceEvent, onceScriptLoad, parseConfig, parseQueryString, render, renderAll, renderButton, renderCount, renderFrameContent, setFrameSize, stringifyQueryString;

  if (typeof window === "undefined") {
    return;
  }

  document = window.document;

  encodeURIComponent = window.encodeURIComponent;

  decodeURIComponent = window.decodeURIComponent;

  createElement = function(tag) {
    return document.createElement(tag);
  };

  createTextNode = function(text) {
    return document.createTextNode(text);
  };

  Math = window.Math;

  BASEURL = (/^http:/.test(document.location) ? "http" : "https") + "://buttons.github.io/";

  BUTTON_CLASS = "github-button";

  GITHUB_API_BASEURL = "https://api.github.com";

  ICON_CLASS = "octicon";

  ICON_CLASS_DEFAULT = ICON_CLASS + "-mark-github";

  UUID = "faa75404-3b97-5585-b449-4bc51338fbd1";

  stringifyQueryString = function(obj) {
    var name, params, value;
    params = [];
    for (name in obj) {
      value = obj[name];
      if (value != null) {
        params.push((encodeURIComponent(name)) + "=" + (encodeURIComponent(value)));
      }
    }
    return params.join("&");
  };

  parseQueryString = function(str) {
    var j, len, pair, params, ref, ref1;
    params = {};
    ref1 = str.split("&");
    for (j = 0, len = ref1.length; j < len; j++) {
      pair = ref1[j];
      if (!(pair !== "")) {
        continue;
      }
      ref = pair.split("=");
      if (ref[0] !== "") {
        params[decodeURIComponent(ref[0])] = decodeURIComponent(ref.slice(1).join("="));
      }
    }
    return params;
  };

  onEvent = function(target, eventName, func) {
    if (target.addEventListener) {
      target.addEventListener("" + eventName, func);
    } else {
      target.attachEvent("on" + eventName, func);
    }
  };

  onceEvent = function(target, eventName, func) {
    var callback;
    callback = function(event) {
      if (target.removeEventListener) {
        target.removeEventListener("" + eventName, callback);
      } else {
        target.detachEvent("on" + eventName, callback);
      }
      return func(event || window.event);
    };
    onEvent(target, eventName, callback);
  };

  onceScriptLoad = function(script, func) {
    var callback, token;
    token = 0;
    callback = function() {
      if (!token && (token = 1)) {
        func();
      }
    };
    onEvent(script, "load", callback);
    onEvent(script, "error", callback);
    onEvent(script, "readystatechange", function() {
      if (!/i/.test(script.readyState)) {
        callback();
      }
    });
  };

  defer = function(func) {
    var callback;
    if (/m/.test(document.readyState) || (!/g/.test(document.readyState) && !document.documentElement.doScroll)) {
      window.setTimeout(func);
    } else {
      if (document.addEventListener) {
        onceEvent(document, "DOMContentLoaded", func);
      } else {
        callback = function() {
          if (/m/.test(document.readyState)) {
            document.detachEvent("onreadystatechange", callback);
            func();
          }
        };
        document.attachEvent("onreadystatechange", callback);
      }
    }
  };

  jsonp = function(url, func) {
    var head, query, ref, script;
    script = createElement("script");
    script.async = true;
    ref = url.split("?");
    query = parseQueryString(ref.slice(1).join("?"));
    query.callback = "_";
    script.src = ref[0] + "?" + stringifyQueryString(query);
    window._ = function(json) {
      delete window._;
      func(json);
    };
    window._.$ = script;
    onEvent(script, "error", function() {
      delete window._;
    });
    if (script.readyState) {
      onEvent(script, "readystatechange", function() {
        if (script.readyState === "loaded" && script.children && script.readyState === "loading") {
          delete window._;
        }
      });
    }
    head = document.getElementsByTagName("head")[0];
    if ("[object Opera]" === {}.toString.call(window.opera)) {
      onEvent(document, "DOMContentLoaded", function() {
        head.appendChild(script);
      });
    } else {
      head.appendChild(script);
    }
  };

  ceilPixel = function(px) {
    var devicePixelRatio;
    devicePixelRatio = window.devicePixelRatio || 1;
    return (devicePixelRatio > 1 ? Math.ceil(Math.round(px * devicePixelRatio) / devicePixelRatio * 2) / 2 : Math.ceil(px)) || 0;
  };

  getFrameContentSize = function(iframe) {
    var body, boundingClientRect, contentDocument, height, html, width;
    contentDocument = iframe.contentWindow.document;
    html = contentDocument.documentElement;
    body = contentDocument.body;
    width = html.scrollWidth;
    height = html.scrollHeight;
    if (body.getBoundingClientRect) {
      body.style.display = "inline-block";
      boundingClientRect = body.getBoundingClientRect();
      width = Math.max(width, ceilPixel(boundingClientRect.width || boundingClientRect.right - boundingClientRect.left));
      height = Math.max(height, ceilPixel(boundingClientRect.height || boundingClientRect.bottom - boundingClientRect.top));
      body.style.display = "";
    }
    return [width, height];
  };

  setFrameSize = function(iframe, size) {
    iframe.style.width = size[0] + "px";
    iframe.style.height = size[1] + "px";
  };

  parseConfig = function(anchor) {
    var attribute, config, deprecate, j, len, ref1;
    config = {
      "href": anchor.href,
      "aria-label": anchor.getAttribute("aria-label")
    };
    ref1 = ["icon", "text", "size", "show-count"];
    for (j = 0, len = ref1.length; j < len; j++) {
      attribute = ref1[j];
      attribute = "data-" + attribute;
      config[attribute] = anchor.getAttribute(attribute);
    }
    if (config["data-text"] == null) {
      config["data-text"] = anchor.textContent || anchor.innerText;
    }
    deprecate = function(oldAttribute, newAttribute, newValue) {
      if (anchor.getAttribute(oldAttribute)) {
        config[newAttribute] = newValue;
        console && console.warn("GitHub Buttons deprecated `" + oldAttribute + "`: use `" + newAttribute + "=\"" + newValue + "\"` instead. Please refer to https://github.com/ntkme/github-buttons#readme for more info.");
      }
    };
    deprecate("data-count-api", "data-show-count", "true");
    deprecate("data-style", "data-size", "large");
    return config;
  };

  createAnchor = function(url, baseUrl) {
    var anchor, base, div, href, javascript;
    anchor = createElement("a");
    javascript = "javascript:";
    if ((anchor.href = baseUrl) && anchor.protocol !== javascript) {
      try {
        href = new URL(url, baseUrl).href;
        if (href == null) {
          throw href;
        }
        anchor.href = href;
      } catch (error) {
        base = document.getElementsByTagName("base")[0];
        base.href = baseUrl;
        anchor.href = url;
        div = createElement("div");
        div.innerHTML = anchor.outerHTML;
        anchor.href = div.lastChild.href;
        div = null;
        base.href = document.location.href;
        base.removeAttribute("href");
      }
    } else {
      anchor.href = url;
    }
    if (anchor.protocol === javascript || !/\.github\.com$/.test("." + anchor.hostname)) {
      anchor.href = "#";
      anchor.target = "_self";
    }
    if (/^https?:\/\/((gist\.)?github\.com\/[^\/?#]+\/[^\/?#]+\/archive\/|github\.com\/[^\/?#]+\/[^\/?#]+\/releases\/download\/|codeload\.github\.com\/)/.test(anchor.href)) {
      anchor.target = "_top";
    }
    return anchor;
  };

  renderButton = function(config) {
    var a, ariaLabel, i, span;
    a = createAnchor(config.href, null);
    a.className = "button";
    if (ariaLabel = config["aria-label"]) {
      a.setAttribute("aria-label", ariaLabel);
    }
    i = a.appendChild(createElement("i"));
    i.className = ICON_CLASS + " " + (config["data-icon"] || ICON_CLASS_DEFAULT);
    i.setAttribute("aria-hidden", "true");
    a.appendChild(createTextNode(" "));
    span = a.appendChild(createElement("span"));
    span.appendChild(createTextNode(config["data-text"] || ""));
    return document.body.appendChild(a);
  };

  renderCount = function(button) {
    var api, href, match, property;
    if (button.hostname !== "github.com") {
      return;
    }
    match = button.pathname.replace(/^(?!\/)/, "/").match(/^\/([^\/?#]+)(?:\/([^\/?#]+)(?:\/(?:(subscription)|(fork)|(issues)|([^\/?#]+)))?)?(?:[\/?#]|$)/);
    if (!(match && !match[6])) {
      return;
    }
    if (match[2]) {
      href = "/" + match[1] + "/" + match[2];
      api = "/repos" + href;
      if (match[3]) {
        property = "subscribers_count";
        href += "/watchers";
      } else if (match[4]) {
        property = "forks_count";
        href += "/network";
      } else if (match[5]) {
        property = "open_issues_count";
        href += "/issues";
      } else {
        property = "stargazers_count";
        href += "/stargazers";
      }
    } else {
      api = "/users/" + match[1];
      property = "followers";
      href = "/" + match[1] + "/" + property;
    }
    jsonp(GITHUB_API_BASEURL + api, function(json) {
      var a, data, span;
      if (json.meta.status === 200) {
        data = json.data[property];
        a = createAnchor(href, button.href);
        a.className = "count";
        a.setAttribute("aria-label", data + " " + (property.replace(/_count$/, "").replace("_", " ")) + " on GitHub");
        a.appendChild(createElement("b"));
        a.appendChild(createElement("i"));
        span = a.appendChild(createElement("span"));
        span.appendChild(createTextNode(("" + data).replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
        button.parentNode.insertBefore(a, button.nextSibling);
      }
    });
  };

  renderFrameContent = function(config) {
    var button;
    if (!config) {
      return;
    }
    if (/^large$/i.test(config["data-size"])) {
      document.body.className = "large";
    }
    button = renderButton(config);
    if (/^(true|1)$/i.test(config["data-show-count"])) {
      renderCount(button);
    }
  };

  render = function(targetNode, config) {
    var contentDocument, hash, iframe, name, onload, ref1, value;
    if (targetNode == null) {
      return renderAll();
    }
    if (config == null) {
      config = parseConfig(targetNode);
    }
    hash = "#" + stringifyQueryString(config);
    iframe = createElement("iframe");
    ref1 = {
      allowtransparency: true,
      scrolling: "no",
      frameBorder: 0
    };
    for (name in ref1) {
      value = ref1[name];
      iframe.setAttribute(name, value);
    }
    setFrameSize(iframe, [1, 0]);
    iframe.style.border = "none";
    iframe.src = "javascript:0";
    document.body.appendChild(iframe);
    onload = function() {
      var size;
      size = getFrameContentSize(iframe);
      iframe.parentNode.removeChild(iframe);
      onceEvent(iframe, "load", function() {
        setFrameSize(iframe, size);
      });
      iframe.src = BASEURL + "buttons.html" + hash;
      targetNode.parentNode.replaceChild(iframe, targetNode);
    };
    onceEvent(iframe, "load", function() {
      var callback;
      if (callback = iframe.contentWindow._) {
        onceScriptLoad(callback.$, onload);
      } else {
        onload();
      }
    });
    contentDocument = iframe.contentWindow.document;
    contentDocument.open().write("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>" + UUID + "</title><base><!--[if lte IE 6]></base><![endif]--><link rel=\"stylesheet\" href=\"" + BASEURL + "assets/css/buttons.css\"><script>document.location.hash = \"" + hash + "\";</script></head><body><script src=\"" + BASEURL + "buttons.js\"></script></body></html>");
    contentDocument.close();
  };

  renderAll = function() {
    var anchor, anchors, j, k, len, len1, ref1;
    anchors = [];
    if (document.querySelectorAll) {
      anchors = anchors.slice.call(document.querySelectorAll("a." + BUTTON_CLASS));
    } else {
      ref1 = document.getElementsByTagName("a");
      for (j = 0, len = ref1.length; j < len; j++) {
        anchor = ref1[j];
        if (~(" " + anchor.className + " ").replace(/[ \t\n\f\r]+/g, " ").indexOf(" " + BUTTON_CLASS + " ")) {
          anchors.push(anchor);
        }
      }
    }
    for (k = 0, len1 = anchors.length; k < len1; k++) {
      anchor = anchors[k];
      render(anchor);
    }
  };

  if (typeof define === "function" && define.amd) {
    define([], {
      render: render
    });
  } else if (typeof exports === "object" && typeof exports.nodeName !== "string") {
    exports.render = render;
  } else {
    if (!{}.hasOwnProperty.call(document, "currentScript") && delete document.currentScript && document.currentScript) {
      BASEURL = document.currentScript.src.replace(/[^\/]*([?#].*)?$/, "");
    }
    if (document.title === UUID) {
      renderFrameContent(parseQueryString(document.location.hash.replace(/^#/, "")));
    } else {
      render();
    }
  }

  if (!{}.hasOwnProperty.call(document, 'currentScript') && delete document.currentScript && document.currentScript) {
    BASEURL = document.currentScript.src.replace(/[^\/]*([?#].*)?$/, '').replace(/[^\/]*\/[^\/]*\/$/, '');
  }

  this.onbeforeunload = function() {};

  defer(function() {
    Vue.component('github-button-preview', {
      template: '#github-button-preview-template',
      props: ['config'],
      data: function() {
        return {
          timeoutId: null
        };
      },
      computed: {
        rateLimitWait: function() {
          if (this.config['data-show-count']) {
            return 300;
          } else {
            return 0;
          }
        }
      },
      mounted: function() {
        var iframe, onload;
        iframe = this.$el.firstChild;
        onload = function() {
          setFrameSize(iframe, getFrameContentSize(iframe));
        };
        onEvent(iframe, 'load', function() {
          var callback;
          if (callback = iframe.contentWindow._) {
            onceScriptLoad(callback.$, onload);
          } else {
            onload();
          }
        });
        this.update();
      },
      updated: function() {
        this.update();
      },
      methods: {
        update: function() {
          var iframe;
          iframe = this.$el.firstChild;
          setFrameSize(iframe, [1, 0]);
          clearTimeout(this.timeoutId);
          this.timeoutId = setTimeout((function(_this) {
            return function() {
              iframe = _this.$el.removeChild(iframe);
              iframe.src = 'buttons.html#' + stringifyQueryString(_this.config);
              _this.$el.appendChild(iframe);
            };
          })(this), this.rateLimitWait);
        }
      }
    });
    Vue.component('github-button-code', {
      template: '#github-button-code-template',
      props: ['text']
    });
    new Vue({
      el: '#app',
      template: '#app-template',
      mounted: function() {
        setTimeout(renderAll);
      },
      updated: function() {
        if (this.focus) {
          this.focus.focus();
          this.focus = null;
        }
      },
      data: function() {
        return {
          script: '<!-- Place this tag in your head or just before your close body tag. -->\n<script async defer src="https://buttons.github.io/buttons.js"></script>',
          focus: null,
          options: {
            type: null,
            user: '',
            repo: '',
            largeButton: false,
            showCount: false,
            standardIcon: false
          }
        };
      },
      watch: {
        'options.type': function() {
          if (document.activeElement !== this.$refs.user && document.activeElement !== this.$refs.repo) {
            if (this.options.type === 'follow' || !this.successes.user || (this.successes.user && this.successes.repo)) {
              this.focus = this.$refs.user;
            } else {
              this.focus = this.$refs.repo;
            }
          }
        }
      },
      computed: {
        code: function() {
          var a, name, ref1, value;
          a = createElement('a');
          a.className = 'github-button';
          a.href = this.config.href;
          a.textContent = this.config['data-text'];
          ref1 = this.config;
          for (name in ref1) {
            value = ref1[name];
            if (name !== 'href' && name !== 'data-text' && (value != null)) {
              a.setAttribute(name, value);
            }
          }
          return '<!-- Place this tag where you want the button to render. -->\n' + a.outerHTML;
        },
        successes: function() {
          return {
            user: (function(user) {
              return 0 < user.length && user.length < 40 && !/[^A-Za-z0-9-]|^-|-$|--/i.test(user);
            })(this.options.user),
            repo: (function(repo) {
              return 0 < repo.length && repo.length < 101 && !/[^\w-.]|\.git$|^\.\.?$/i.test(repo);
            })(this.options.repo)
          };
        },
        hasSuccess: function() {
          if (this.options.type === 'follow') {
            return this.successes.user;
          } else {
            return this.successes.user && this.successes.repo;
          }
        },
        dangers: function() {
          return {
            user: this.options.user !== '' && !this.successes.user,
            repo: this.options.type !== 'follow' && this.options.repo !== '' && !this.successes.repo
          };
        },
        hasDanger: function() {
          return this.dangers.user || this.dangers.repo;
        },
        config: function() {
          var options;
          if (this.options.type == null) {
            return;
          }
          options = {
            type: this.options.type,
            user: this.hasSuccess ? this.options.user : 'ntkme',
            repo: this.hasSuccess ? this.options.repo : 'github-buttons',
            largeButton: this.options.largeButton,
            showCount: this.options.showCount,
            standardIcon: this.options.standardIcon
          };
          return {
            href: (function() {
              var base, repo, user;
              base = 'https://github.com';
              user = '/' + options.user;
              repo = user + '/' + options.repo;
              switch (options.type) {
                case 'follow':
                  return base + user;
                case 'watch':
                  return base + repo + '/subscription';
                case 'star':
                  return base + repo;
                case 'fork':
                  return base + repo + '/fork';
                case 'issue':
                  return base + repo + '/issues';
                case 'download':
                  return base + repo + '/archive/master.zip';
                default:
                  return base;
              }
            })(),
            'data-text': (function() {
              switch (options.type) {
                case 'follow':
                  return 'Follow @' + options.user;
                default:
                  return options.type.charAt(0).toUpperCase() + options.type.slice(1).toLowerCase();
              }
            })(),
            'data-icon': (function() {
              if (options.standardIcon) {
                return;
              }
              switch (options.type) {
                case 'watch':
                  return 'octicon-eye';
                case 'star':
                  return 'octicon-star';
                case 'fork':
                  return 'octicon-repo-forked';
                case 'issue':
                  return 'octicon-issue-opened';
                case 'download':
                  return 'octicon-cloud-download';
              }
            })(),
            'data-size': (function() {
              if (options.largeButton) {
                return 'large';
              } else {
                return null;
              }
            })(),
            'data-show-count': (function() {
              if (options.showCount) {
                switch (options.type) {
                  case 'download':
                    return null;
                  default:
                    return true;
                }
              }
              return null;
            })(),
            'aria-label': (function() {
              switch (options.type) {
                case 'follow':
                  return 'Follow @' + options.user + ' on GitHub';
                case 'watch':
                case 'star':
                case 'fork':
                case 'issue':
                case 'download':
                  return (options.type.charAt(0).toUpperCase() + options.type.slice(1).toLowerCase()) + ' ' + options.user + '/' + options.repo + ' on GitHub';
                default:
                  return 'GitHub';
              }
            })()
          };
        }
      }
    });
  });

}).call(this);
