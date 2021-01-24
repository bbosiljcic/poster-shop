const LOAD_NUM = 4;
let watcher;

new Vue({
  el: "#app",
  data: {
    total: 0,
    products: [],
    cart: [],
    search: "cat",
    lastSearch: "",
    loading: false,
    results: [],
  },
  methods: {
    addToCart: function(prod) {
      const item = this.cart.find((i) => i.id === prod.id);
      if (item) {
        item.qty++
      } else {
        this.cart.push({
          ...prod,
          qty: 1,
        });
      }


      this.total += prod.price;
    },
    inc: function(item) {
      item.qty++;
      this.total += item.price;
    },
    dec: function(item) {
      if (item.qty <= 0) {
        const index = this.cart.indexOf(item);
        this.cart.splice(index, 1);
      }
      item.qty--
      this.total -= item.price;
    },
    onSubmit: function() {
      this.products = [];
      const path = "/search?q=".concat(this.search);
      this.loading = true;
      this.$http.get(path).then((res) => {
        this.loading = false;
        this.results = res.body;
        this.appendResults();
        this.products = res.body.slice(0, LOAD_NUM);
        this.lastSearch = this.search;
      })
    },
    appendResults: function()  {
      if(this.products.length < this.results.length) {
        const toAppend = this.results.slice(
          this.products.length,
          LOAD_NUM + this.products.length
        );
        this.products = this.products.concat(toAppend);
      }
    }
  },
  filters: {
    currency: function(price) {
      return `${price.toFixed(2)} €`;
    }
  },
  created: function() {
    this.onSubmit();
  },
  updated: function() {
    const sensor = document.querySelector("#product-list-bottom");
    watcher = scrollMonitor.create(sensor);
    watcher.enterViewport(this.appendResults);
  },
  beforeUpdated: function() {
    if (watcher) {
      watcher.destroy;
      watcher = null;
    }
  },
});

