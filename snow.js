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
  return new Proxy(obj, { get(target, key) {
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
    const buttons = this.$el.querySelectorAll('[data-action]');
    buttons.forEach(button => {
      const methodName = button.getAttribute('data-action');
      if (methodName && this.$methods[methodName]) button.addEventListener('click', this.$methods[methodName].bind(this));
    });

    const clickableElements = this.$el.querySelectorAll('[snowclick]');
    clickableElements.forEach(el => {
      const methodName = el.getAttribute('snowclick');
      if (methodName && this.$methods[methodName]) el.addEventListener('click', this.$methods[methodName].bind(this));
    });
  }

  #parseDirectives(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const elements = tempDiv.querySelectorAll('[snow-if]');
    elements.forEach(el => {
      const condition = el.getAttribute('snow-if');
      try {
        const context = this.$snowball;
        const fn = new Function('snow', `return ${condition};`);
        if (!fn(context))  el.remove();
      } catch (error) {
        console.error(`Error evaluating snow-if condition: "${condition}"`, error);
        el.remove();
      }
    });

    return tempDiv.innerHTML;
  }
}
export default Snow;
