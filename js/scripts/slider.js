$(function()
    {
        var $s, api;

        $.fx.off = true;
        QUnit.config.reorder = false;

        var lifecycle = {
            setup: function()
            {
                if ( ! api )
                {
                    $s = $('.slideshow').slides();
                    api = $s.eq(0).data('slides');
                }
            }
        };

        module("Setup", lifecycle);

        test("$(collection).slides()", function()
        {
            ok(api.count > 0, "Check slides are found");
            ok(api.$pagination.length > 0, "Check pagination created");
            ok(api.$next.length > 0, "Check next skip link created");
            ok(api.$prev.length > 0, "Check previous skip link created");
        });

        test("API", function()
        {
            equal((typeof api).toLowerCase() == "object" && ! $.isEmptyObject(api), true, "API returned");
        });

            //
            // API tests
            //

            module("Public API", lifecycle);

            test(".hasNext()", function()
            {
                api.to(0);
                equal(api.hasNext(), true, "First slide");

                api.to( api.count -1 );
                equal(api.hasNext(), false, "Last slide");
            });

            test(".hasPrevious()", function()
            {
                api.to(0);
                equal(api.hasPrevious(), false, "First slide");

                api.to( api.count - 1 );
                equal(api.hasPrevious(), true, "Last slide");
            });

            test(".next()", function()
            {
                api.to(0);
                var prev = api.current;

                api.next();
                equal(prev + 1, api.current, "Current slide equals last slide + 1");
            });

            test(".previous()", function()
            {
                api.to( api.count - 1 );
                var prev = api.current;

                api.previous();
                equal(prev - 1, api.current, "Current slide equals last slide - 1");
            });

            test(".to()", function()
            {
                api.to(0);
                equal(api.current, 0, "Go-to first slide");

                api.to( api.count - 1 );
                equal(api.current, api.count - 1, "Go-to last slide");

                // loop
                $.extend(api.opts, { loop: true });

                api.to(0);
                api.to( api.current - 1 );
                equal(api.current, api.count - 1, "Out of bounds (0 - 1) - looping enabled");

                api.to( api.count - 1 );
                api.to( api.current + 1 );
                equal(api.current, 0, "Out of bounds (total + 1) - looping enabled");

                // no loop
                $.extend(api.opts, { loop: false });

                api.to(0);
                api.to( api.current - 1 );
                equal(api.current, 0, "Out of bounds (0 - 1) - looping disabled");

                api.to( api.count - 1 );
                api.to( api.current + 1 );
                equal(api.current, api.count - 1, "Out of bounds (total + 1) - looping disabled");
            });

test(".redraw()", function()
{
    api.redraw("crossfade");
    equal(api.opts.transition, "crossfade", "Test crossfade registered");

    api.redraw("scroll");
    equal(api.opts.transition, "scroll", "Test scroll registered");
});

            //
            // user controls
            //

            module("User controls", lifecycle);

            test("Next skip link (looping)", function()
            {
                api.to(0);
                api.$next.trigger('click');
                equal(api.current, 1, "From first to second slide");

                // loop
                $.extend(api.opts, { loop: true });

                api.to( api.count - 1 );
                api.$next.trigger('click');
                equal(api.current, 0, "Attempt to go to from last to first slide - looping enabled");

                // no loop
                $.extend(api.opts, { loop: false });

                api.to( api.count - 1 );
                api.$next.trigger('click');
                equal(api.current, api.count - 1, "Attempt to go to from last to first slide - looping disabled");
            });

            test("Previous skip link", function()
            {
                api.to( api.count - 1 );
                api.$prev.trigger('click');
                equal(api.current, api.count - 2, "From last to preceding slide");

                // loop
                $.extend(api.opts, { loop: true });

                api.to(0);
                api.$prev.trigger('click');
                equal(api.current, api.count - 1, "Attempt to go to from first to last slide - looping enabled");

                // no loop
                $.extend(api.opts, { loop: false });

                api.to(0);
                api.$prev.trigger('click');
                equal(api.current, 0, "Attempt to go to from first to last slide - looping disabled");
            });

            test("Pagination", function()
            {
                var $links = api.$pagination.find('a');

                $links.eq(0).trigger('click');
                equal(api.current, 0, "Go to first slide");

                $links.eq( api.count - 1 ).trigger('click');
                equal(api.current, api.count - 1, "Go to last slide");
            });

        });