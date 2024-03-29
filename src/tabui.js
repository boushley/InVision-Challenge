(function ($, undefined) {

    window.TabUI = {};

    TabUI.TabControl = function (baseElement, options) {
        // Don't require an options parameter
        options = options || {};

        var base = this.base = $(baseElement)
          , list = this.list = this.base.children('ul,ol')
          , lis = list.children('li')
          , tabs = this.tabs = []

          , width = base.width()
          , height = base.height()
          , tabWidth = Math.floor((width / lis.length))
          , tabHeight = options.tabHeight || TabUI.DEFAULT_TAB_HEIGHT

          , isSomethingSelected = false
          , selectedClass = options.selectedClass || TabUI.DEFAULT_SELECTED_CLASS

          , tabOptions = {}
          , tabChangeHandler = options.tabChangeHandler || $.noop

          , selectHandler = function (e, selectedTab) {
              for (var i in tabs) {
                  tabs[i].processSelection(tabs[i] === selectedTab);
              }

              tabChangeHandler(selectedTab);
            }

        // Ensure that we have valid contents
        if (list.length < 1) {
            throw new Error(TabUI.INVALID_CONTENTS);
        }

        // Setup each of the tabs
        tabOptions.selectedClass = selectedClass;
        tabOptions.eagerLoadContent = options.eagerLoadContent || false;
        lis.each(function () {
            var tab = new TabUI.Tab(this, tabOptions)
              , $this = $(this);

            // Ensure only one tab starts selected
            if (tab.isSelected) {
                if (isSomethingSelected) {
                    tab.processSelection(false);
                }
                isSomethingSelected = true;
            }

            // Do the general setup work for events and the body element
            tab.base.bind(TabUI.SELECT_EVENT, selectHandler);
            tab.body.remove();
            base.append(tab.body);

            // Setup the width, height and other styles
            TabUI.Util.setDimensions(tab.body, width, height);
            TabUI.Util.setDimensions($this, tabWidth, tabHeight);
            $this.css({'float': 'left'});

            // Save this tab to our list
            tabs.push(tab);
        });

        // If nothing is selected select the first tab
        if (!isSomethingSelected && tabs.length > 0) {
            tabs[0].processSelection(true);
        }

        // Set some styles for the headers
        TabUI.Util.setDimensions(list, width, tabHeight);
    };

    TabUI.Tab = function (baseElement, options) {
        var base = this.base = $(baseElement)
          , body = this.body = base.children('div')
          , header = this.header = base.children('h1,h2,h3,h4,h5,h6')
          , selectedClass = options.selectedClass
          , self = this

          , contentUrl = body.attr('data-content-url')
          , contentLoaded = false
          , loadContent = function () {
                  if (contentUrl) {
                      body.load(contentUrl);
                  }
                  contentLoaded = true;
              };

        // Setup the selection methods
        this.select = function () {
            if (!self.isSelected) {
                base.trigger(TabUI.SELECT_EVENT, self);
            }
        };
        base.click(this.select);
        header.click(this.select);

        // Method to put the tab into the selected state
        this.processSelection = function (selected) {
            base.toggleClass(selectedClass, selected);
            body.toggle(selected);
            this.isSelected = selected;

            // Load content via ajax if necessary
            if (selected && !contentLoaded) {
                loadContent();
            }
        };

        // Setup the styles of the header
        header.css({'display': 'inline'});

        // Lets make sure the body is in the correct state
        this.isSelected = base.hasClass(selectedClass);
        body.toggle(this.isSelected);

        // Load content via ajax if necessary
        if (options.eagerLoadContent) {
            loadContent();
        }
    };

    $.fn.tabui = function (options) {
        var control = new TabUI.TabControl(this, options);
        return control;
    };

    TabUI.DEFAULT_TAB_HEIGHT = 25;
    TabUI.DEFAULT_SELECTED_CLASS = 'selected';
    TabUI.SELECT_EVENT = 'selected';
    TabUI.INVALID_CONTENTS = 'TabUI expects a ul within the target container.'

    TabUI.Util = {};
    TabUI.Util.setDimensions = function (element, width, height) {
        var extraDimension;

        element.width(width).height(height);

        extraDimension = element.outerWidth(true) - width;
        if (extraDimension) {
            element.width(width - extraDimension);
        }
        extraDimension = element.outerHeight(true) - height;
        if (extraDimension) {
            element.height(height - extraDimension);
        }
    };

})(jQuery)
