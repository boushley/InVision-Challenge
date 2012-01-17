describe('tabui', function () {
    var base
      , defaultContents = '<div><ul>' +
            '<li> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
            '<li class="selected"> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
            '<li> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
            '</ul></div>'
      , multipleSelectedContents = '<div><ul>' +
            '<li class="selected"> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
            '<li class="selected"> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
            '<li class="selected"> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
            '</ul></div>';

    afterEach(function () {
        if (base)
            base.remove();
        base = null;
    });

    it('should throw if the target has no ul as a child', function () {
        base = $('<div></div>').append('body');

        expect(base.tabui).toThrow(new Error('TabUI expects a ul within the target container.'));
    });

    it('should find the immediate child ul within the container', function () {
        base = $(defaultContents).append('body');
        var tabControl = base.tabui();

        expect(tabControl.ul[0]).toBe(base.children('ul')[0]);
    });

    it('should hide all the contents besides the selected one', function () {
        base = $(defaultContents).append('body');
        var tabControl = base.tabui()
          , isSelected
          , isVisible;

        for (tab in tabControl.tabs) {
            isSelected = tab.isSelected
            isVisible = tab.body.is(':visible');

            expect(isVisible).toBe(isSelected);
        }
    });

    it('should only allow one selected tab', function () {
        base = $(multipleSelectedContents).append('body');
        var tabControl = base.tabui()
          , numberSelected = 0;

        for (tab in tabControl.tabs) {
            if (tab.isSelected)
                numberSelected++;
        }

        expect(numberSelected).toBe(1);
    });

    it('should unselect any selected tabs when a new tab is selected', function () {
        base = $(defaultContents).append('body');
        var tabControl = base.tabui()
          , selectedTab
          , unselectedTab;

        for (tab in tabControl.tabs) {
            if (tab.isSelected)
                selectedTab = tab;
            else
                unselectedTab = tab;
        }

        expect(selectedTab.isSelected).toBe(true);
        expect(unselectedTab.isSelected).toBe(false);

        unselectedTab.select();

        expect(selectedTab.isSelected).toBe(false);
        expect(unselectedTab.isSelected).toBe(true);
    });

    it('should change the visible content to match the selected tab', function () {
        base = $(defaultContents).append('body');
        var tabControl = base.tabui()
          , selectedTab
          , unselectedTab;

        for (tab in tabControl.tabs) {
            if (tab.isSelected)
                selectedTab = tab;
            else
                unselectedTab = tab;
        }

        expect(selectedTab.isSelected).toBe(true);
        expect(selectedTab.body.is(':visible')).toBe(true);

        expect(unselectedTab.isSelected).toBe(false);
        expect(unselectedTab.body.is(':visible')).toBe(false);

        unselectedTab.select();

        expect(selectedTab.isSelected).toBe(false);
        expect(selectedTab.body.is(':visible')).toBe(false);

        expect(unselectedTab.isSelected).toBe(true);
        expect(unselectedTab.body.is(':visible')).toBe(true);
    });
});
