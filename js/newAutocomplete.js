class Autocomplete {
  constructor(options) {
    this.input = options.input;
    this.result = options.result;
    this.prevValue = '';
    this.activeHintIndex = 0;
    this.url = options.url;
    this.dataLength = 0;
    this.liLast = this.result.find("li:last");
    this.liFirst = this.result.find("li:first");
    this.KEY_ENTER = 13;
    this.KEY_UP = 38;
    this.KEY_DOWN = 40;
    this.items = [];
  }

  firstCall() {
    this.input.on("keyup", this.onKeyUp.bind(this));
  }

  onKeyUp() {
    var value = this.input.val();

    value = value.replace(/[^a-z]/gi, '');

    if (this.prevValue === value) return;

    if (value === '') this.activeHintIndex = 0;

    if (value != '') {
      $.post(this.url, { value: value }).done(this.onSuccess.bind(this));
    }
    else this.result.empty();

    this.prevValue = value;
  };

  addHintItem(item, i) {
    const el = document.createElement('li');
    el.innerText = item.city;
    el.setAttribute("data", i);

    this.items.push({
      el: el,
      id: item.id,
      city: item.city
    });

    this.result[0].appendChild(el);
  }

  onSuccess(data) {
    this.result.empty();

    if(data.length === 0) {
      this.result.append("<li>" + "Not found." + "</li>");
      return;
    }

    data.forEach(function (item, i, data) {

      if (item != '') this.addHintItem(item, i);
    }.bind(this));

    this.dataLength = data.length - 1;

    var that = this;

    this.result.find('li').on('click', function (e) {
      e.preventDefault();

      that.input.val($(this).text());
      that.result.empty();
    });

    $(window).on("keydown", this.onKeyDown.bind(this));
  };

  onKeyDown(event) {

    var keyCode = event.keyCode;
    var liLast = $("#resultList li:last");
    var liFirst = $("#resultList li:first");

    if (keyCode == this.KEY_UP) this.changeActiveLi(liLast, this.KEY_UP);
    if (keyCode == this.KEY_DOWN) this.changeActiveLi(liFirst, this.KEY_DOWN);

    if (event.keyCode == this.KEY_ENTER && this.activeHintIndex != 0) {

      this.input.val(this.result.find("li.bgGreen").text());
      //add input hidden
    }
  }

  changeActiveLi(activeLi, keyCode) {

    if (this.activeHintIndex === 0) {
      activeLi.addClass("bgGreen");
    }
    else {
      var prevLi = this.result.find("li.bgGreen");
      var prevIndex = prevLi.attr("data");

      if ((prevIndex == 0 && keyCode == this.KEY_UP) || (prevIndex == this.dataLength && keyCode == this.KEY_DOWN)) {
        prevLi.removeClass("bgGreen");
        activeLi.addClass("bgGreen");
      }
      else {
        var index;
        var nextLi;

        if (keyCode == this.KEY_UP) index = +prevIndex - 1;
        if (keyCode == this.KEY_DOWN) index = +prevIndex + 1;

        nextLi = $('[data = ' + index + ']');
        nextLi.addClass("bgGreen");
        prevLi.removeClass("bgGreen");
      }
    }
    this.activeHintIndex = 1;
  }

}

