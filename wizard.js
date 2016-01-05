
/*
 * jwizard-bootstrap
 * Emeric BAVEUX (Emeric0101)
 * version 0.1
 */

var wizard = {};

/**
 * Used for calling a user callback 'data-callback' in the tab, if exist
 * @param {jobject} wrapper
 * @param {integer} page
 * @returns {boolean}
 */
wizard.callPageCallback = function(wrapper, page, nextPage) {
    var continuer = true;
    wrapper.data("pages").each(function () {
        if ($(this).attr("data-id") == page && typeof($(this).attr("data-callback")) !== "undefined") {
            // function we want to run
            var fnstring = $(this).attr("data-callback");
            
            // find object
            var fn = window[fnstring];
            // is object a function?
            if (typeof fn === "function") {
                $(".wizardLoading").show();
                continuer = fn(nextPage);
                $(".wizardLoading").hide();
            }

        }
    });
    return continuer;
};

/**
  * Used for updating page
*/
wizard.updatePage = function (wrapper) {
    var page = wrapper.data('page');
    wrapper.data("pages").each(function () {
        if ($(this).attr("data-id") == page) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });

    wrapper.data('tabsUl').children('li').each(function () {
        if ($(this).attr("data-id") == page) {
            $(this).addClass("active");
        }
        else {
            $(this).removeClass("active");
        }
    });
    
    // toolbox
    wrapper.children('.toolbox').children('.btn').removeClass("disabled");
    // Updating btn state
    if (wrapper.data('page') == 1) {
        wrapper.children('.toolbox').children('.validButton').addClass('disabled');
        wrapper.children('.toolbox').children('.previousButton').addClass('disabled');
    }
    else if (wrapper.data('pageNb') == wrapper.data('page')) {
        wrapper.children('.toolbox').children('.nextButton').addClass('disabled');
        wrapper.children('.toolbox').children('.validButton').removeClass('disabled');
    }
    else {
        wrapper.children('.toolbox').children('.validButton').addClass('disabled');
    }
};
/**
 * 
 * @param {type} options
 * @param {type} arg1
 * @param {type} arg2
 * @returns {$.fn@call;each|undefined}
 */
$.fn.wizard = function (options, arg1, arg2) {
    /**
     * Fonction goto
     * arg1 int page requested
     * arg2 bool don't use the callback check function
     */
    if (options === "goto") {
        var force = false;
        if (typeof(arg2) !== "undefined") {
            force = arg2;
        }
        if (typeof(arg1) !== "undefined") {
            this.each(function() {
                var page = arg1;
                var settings = $(this).data("settings");
                settings.change(parseInt(page - settings.wrapper.data("page")), force);
            });
        }
        else {
            throw "Wizard : Argument not valid";
        }
        return;
    }
    // Defaults options
    var defauts =
            {
                wizardMode: true,
                callback: null,
                wrapper: null,
                anchor: '#generalWrapper',
				nextCaption: 'Next',
				previousCaption: 'Previous',
				submitCaption:'Submit',
                change: function(direction, force) {
                    if (typeof force === "undefined") { var force = false; }
                    $(this).each(function(index) {
						var wrapper = $(this)[index].wrapper;
						// On va voir si ya besoin d'appeler uen fonction pour passer à la fenetre suivante
						var page = wrapper.data('page');
						var nextPage = parseInt(page) + direction;
						if (!force) {
							if (direction > 0) {
								for (var i=page;i<nextPage;i++) {
									if (!wizard.callPageCallback(wrapper, i, nextPage)) {return;}
								}
							}
							else {
								for (var i=page;i>nextPage;i--) {
									if (!wizard.callPageCallback(wrapper, i, nextPage)) {return;}
								}
							}
						}

						// Change page
						if (direction > 0 && page < wrapper.data('pageNb') || direction < 0 && wrapper.data('page') > 1) {
							if (!wrapper.data('tabsUl').children('li[data-id="' + nextPage + '"]').hasClass("disabled")) {
								wrapper.data('page', parseInt(page) + direction);
								wizard.updatePage(wrapper);
							}
						}

                    });

                }
            };

    var settings = $.extend(defauts, options);

    return this.each(function ()
    {
        // Getting pages and setting them
        var pages = $(this).children('.page');
        if (typeof(settings.callback) === 'function') {
            settings.callback = [{caption: settings.submitCaption, callback: settings.callback}];
        }
        
        if (settings.wizardMode === false) {
            pages.show();
            pages.each(function() {
                $(this).after($("<hr/>"));
            });
            // If no callback, no submit button
            if (settings.callback !== null) {
                for (var i in settings.callback) {
                    pages.parent().append(
                    $("<div/>")
                    .addClass('textAlignCenter')
                        .html(
                    $("<div/>")
                    .data("callback", settings.callback[i].callback)
                    .addClass("btn btn-primary")
                    .click(function () {
                        var cb = $(this).data('callback');
                        cb();
                    })
                    .html(settings.callback[i].caption)
                    )
                );
                }

            }
            return true;
        }
        
        var wrapper = $(this);
        settings.wrapper = wrapper;
        $(this).data('settings', settings);
        $(this).addClass("wizard form-horizontal");
        $(this).data('pages', pages);
        $(this).data('pageNb', pages.length);
        $(this).data('page', 1);

        var tabsUl = $("<ul/>");
        tabsUl.attr("data-tabs", "tabs");
        tabsUl.addClass("nav nav-tabs");
        $(this).data('tabsUl', tabsUl);
        var tabIndex = 0;
        pages.each(function () {
            tabIndex++;
            $(this).attr("data-id", tabIndex);

            // Si pas de titre
            var title = $(this).attr("data-title");
            if (typeof (title) === "undefined") {
                title = "Etape " + tabIndex;
            }

            // Si l'onglet est actif ou non
            var active = $(this).attr("data-enabled");
            if (typeof (active) === "undefined" || active === "true") {
                active = "";
            }
            else {
                active = "disabled";
            }

            // Si c'est le premier
            if (tabIndex === 1) {
                active += " active";
                $(this).show();
            }
            else {
                // On cache
                $(this).hide();
            }

            tabsUl.append(
                    $("<li/>")
                    .hover(
                            function() {
                                    if ($(this).hasClass('disabled')) {
                                            $(this).attr("title", "Vous devez avoir rempli les étapes précédentes pour cliquer ici.");
                                    }
                                    else {
                                            $(this).attr("title", "");
                                    }
                            })
                    .data('wrapper', wrapper)
                    .html($("<a/>").html(title))
                    .attr("data-id", tabIndex)
                    .addClass(active + " cursorPointer wizardTab")
                    .click(function () {
                        $(this).data("wrapper").wizard("goto", $(this).attr("data-id"));
                    })
                    );
        });

        // # ONGLET

        var tabs = $("<div/>");
        tabs.append(tabsUl);

        $(this).prepend(tabs);
        tabs.tab();

        // # TITRE

        var title = $(this).attr("data-title");
        if (typeof (title) !== "undefined") {
            $(this).prepend($("<h3/>").html(title));
        }
        var boutonValider = [];
        for (var i in settings.callback) {
            var bouton = $("<a/>")
                    .attr("href", settings.anchor)
                    .data("callback", settings.callback[i].callback)
                    .addClass("btn btn-primary")
                    .click(function () {
                        if (!$(this).hasClass("disabled")) {
                            var cb = $(this).data('callback');
                            cb();
                        }
                    })
                    .html(settings.callback[i].caption);
            // Permet de suivre ou non l'activation du bouton valider
            if (typeof (settings.callback[i].alwaysEnable) === 'undefined' || settings.callback[i].alwaysEnable == false) {
                bouton.addClass("validButton disabled");
            }
            // Téléphone : 
            var boutonMobile = $("<a/>")
                    .attr("href", settings.anchor)
                    .data("callback", settings.callback[i].callback)
                    .addClass("btn btn-primary displayNone validMobileButton")
                    .click(function () {
                        var cb = $(this).data('callback');
                        cb();
                    })
                    .html(settings.callback[i].caption);
            boutonValider.push(bouton);
            boutonValider.push(boutonMobile);
        }
                
        // Boite de bouton
        var buttonBox = $("<div/>");
        buttonBox
                .attr("class", "toolbox")
                .append(
                        $("<a/>")
                        .attr("href", settings.anchor)
                        .data("wrapper", $(this))
                        .addClass("btn btn-primary disabled previousButton")
                        .click(function () {
                            var settings = $(this).data("wrapper").data("settings");
                            settings.change(-1);
                        })
                        .html(settings.previousCaption),
                        $("<a/>")
                        .attr("href", settings.anchor)
                        .data("wrapper", $(this))
                        .addClass("btn btn-primary nextButton")
                        .click(function () {
                            var settings = $(this).data("wrapper").data("settings");
                            settings.change(1);
                        })
                        .html(settings.nextCaption),
                        boutonValider,
                        $("<span/>").addClass("wizardLoading").hide().html('Merci de patienter...'),
                        $("<div/>").addClass("clearBoth")
                        );

        $(this).append(buttonBox);
        $(this).show();
        
    });

};


