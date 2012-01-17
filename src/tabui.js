(function ($, undefined) {

    $.fn.tabui = function () {
        var control = new TabUI.TabControl(this);
        return control;
    };

    window.TabUI = {};

    TabUI.TabControl = function (baseElement) {
        var base = this.base = $(baseElement)
          , list = this.list = this.base.children('ul')
          , tabs = this.tabs = []
          , lis = list.children('li')
          , height = base.height() - 20
          , width = base.width()
          , tabWidth = Math.floor((width / lis.length) - 4)
          , isSomethingSelected = false
          , selectHandler = function (e, selectedTab) {
              for (var i in tabs) {
                  var tab = tabs[i];

                  if (tab === selectedTab)
                      tab.processSelect();
                  else
                      tab.processUnselect();
              }
            }

        if (list.length < 1)
            throw new Error(TabUI.INVALID_CONTENTS);

        lis.each(function () {
            var tab = new TabUI.Tab(this);

            if (tab.isSelected)
            {
                if (isSomethingSelected)
                {
                    tab.processUnselect();
                }
                isSomethingSelected = true;
            }

            tab.base.bind(TabUI.SELECT_EVENT, selectHandler);

            tab.body.css({'width': width + 'px', 'height': height + 'px'});
            tab.body.remove();
            base.append(tab.body);

            tabs.push(tab);
        });

        // If nothing is selected select the first tab
        if (!isSomethingSelected)
            tabs[0].processSelect();

        list.css({'width': width + 'px', 'height': 20 + 'px'});
        lis.css({
            'height': '20px'
          , 'width': tabWidth + 'px'
          , 'float': 'left'
        });

    };

    TabUI.Tab = function (baseElement) {
        var base = this.base = $(baseElement)
          , body = this.body = base.children('div')
          , header = this.header = base.children('h1,h2,h3,h4,h5,h6')
          , self = this;

        this.isSelected = base.hasClass(TabUI.SELECTED_CLASS);

        base.click(function () { 
            base.trigger(TabUI.SELECT_EVENT, self);
        });
        header.click(function () { 
            base.trigger(TabUI.SELECT_EVENT, self);
        });
        this.select = function () {
            base.trigger(TabUI.SELECT_EVENT, self);
        };

        this.processSelect = function () {
            base.addClass(TabUI.SELECTED_CLASS);
            body.show();
            this.isSelected = true;
        };

        this.processUnselect = function () {
            base.removeClass(TabUI.SELECTED_CLASS);
            body.hide();
            this.isSelected = false;
        };

        // Lets make sure the body is in the correct state
        if (this.isSelected)
            body.show();
        else
            body.hide();
    };

    TabUI.SELECTED_CLASS = 'selected';
    TabUI.SELECT_EVENT = 'selected';
    TabUI.INVALID_CONTENTS = 'TabUI expects a ul within the target container.'

})(jQuery)
