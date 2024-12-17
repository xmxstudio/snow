    class Snow {
      constructor(options) {
        if (!document.querySelector(options.snowing)) {
          const defaultEl = document.createElement("div");
          defaultEl.id = options.snowing.replace('#', '');
          document.body.appendChild(defaultEl);
        }
        this.$snowball = this.#makeReactive(options.snowbits());
        this.$template = options.snowflake;
        this.$el = document.querySelector(options.snowing);
        this.$methods = options.snowfights || {};
        this.#render();
      }

      #makeReactive(obj) {
        const self = this;
        return new Proxy(obj, {
          get(target, key) {
            const value = target[key];
            if (Array.isArray(value)) {
              return new Proxy(value, {
                set(arrTarget, arrKey, arrValue) {
                  arrTarget[arrKey] = arrValue;
                  self.#render();
                  return true;
                },
                apply(arrTarget, thisArg, args) {
                  const result = Reflect.apply(arrTarget, thisArg, args);
                  self.#render();
                  return result;
                }
              });
            }
            return value;
          },
          set(target, key, value) {
            target[key] = value;
            self.#render();
            return true;
          }
        });
      }

      #render() {
        const html = this.#parseDirectives(this.$template(this.$snowball));
        this.$el.innerHTML = html;
        this.#bindMethods();
      }

      #bindMethods() {
        const clickableElements = this.$el.querySelectorAll('[snowclick]');
        clickableElements.forEach(el => {
          const methodName = el.getAttribute('snowclick');
          if (methodName && this.$methods[methodName]) {
            el.addEventListener('click', this.$methods[methodName].bind(this));
          }
        });
      }

      #parseDirectives(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Handle snow-for
        tempDiv.querySelectorAll('[snow-for]').forEach(el => {
          const expression = el.getAttribute('snow-for');
          const [itemName, arrayName] = expression.split(' in ').map(s => s.trim());
          const items = this.$snowball[arrayName];

          if (Array.isArray(items)) {
            items.forEach((item, index) => {
              const clone = el.cloneNode(true);
              clone.innerHTML = clone.innerHTML.replace(new RegExp(`{{\\s*${itemName}\\s*}}`, 'g'), item);
              clone.setAttribute('data-index', index); // Add index attribute to each cloned element
              el.parentNode.insertBefore(clone, el);
            });
          }
          el.remove(); // Remove original template node
        });

        // Handle snow-if
        tempDiv.querySelectorAll('[snow-if]').forEach(el => {
          const condition = el.getAttribute('snow-if');
          try {
            const context = this.$snowball;
            const fn = new Function('snow', `return ${condition};`);
            if (!fn(context)) el.remove();
          } catch (error) {
            console.error(`Error evaluating snow-if condition: "${condition}"`, error);
            el.remove();
          }
        });

        return tempDiv.innerHTML;
      }
    }
