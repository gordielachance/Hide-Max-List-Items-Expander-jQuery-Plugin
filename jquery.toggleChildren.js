// HIDE MAX LIST ITEMS JQUERY PLUGIN
// Version: 1.36
// Author: Josh Winn
// Website: www.joshuawinn.com
// Usage: Free and Open Source. WTFPL: http://sam.zoy.org/wtfpl/
(function($){
    $.fn.extend({ 
        toggleChildren: function(options){
            // OPTIONS
            var defaults = {
                selector:   '> *',
                max:        3,
                speed:      1000,
                moreText:   'READ MORE',
                lessText:   'READ LESS',
                moreHTML:   '<p class="toggle-children-link"><a href="#"></a></p>', // requires class and child <a>
            };
            var options =  $.extend(defaults, options);

            // FOR EACH MATCHED ELEMENT
            return this.each(function() {
                var op =                options;
                var $container =        $(this);
                var $children =         $container.find(op.selector);
                var totalChildren =     $children.length;
                var speedPerChild;

                // Get animation speed per LI; Divide the total speed by num of LIs. 
                // Avoid dividing by 0 and make it at least 1 for small numbers.
                if ( totalChildren > 0 && op.speed > 0  ){ 
                    speedPerChild = Math.round( op.speed / totalChildren );
                    if ( speedPerChild < 1 ) { speedPerChild = 1; }
                } else { 
                    speedPerChild = 0; 
                }

                // If list has more than the "max" option
                if ( (totalChildren > 0) && (totalChildren > op.max) )
                {
                    // Initial Page Load: Hide each LI element over the max
                    $children.each(function(index){
                        if ( (index+1) > op.max ) {
                            $(this).hide(0);
                        } else {
                            $(this).show(0);
                        }
                    });

                    // Replace [COUNT] in "moreText" or "lessText" with number of items beyond max
                    var howManyMore = totalChildren - op.max;
                    var newMoreText = op.moreText;
                    var newLessText = op.lessText;

                    if ( howManyMore > 0 ){
                        newMoreText = newMoreText.replace("[COUNT]", howManyMore);
                        newLessText = newLessText.replace("[COUNT]", howManyMore);
                    }

                    // Add "Read More" button, or unhide it if it already exists
                    if ( $container.next(".toggle-children-link").length > 0 ){
                        $container.next(".toggle-children-link").show();
                    } else {
                        $container.after(op.moreHTML);
                    }

                    // READ MORE - add text within button, register click event that slides the items up and down
                    $container.next(".toggle-children-link")
                        .children("a")
                            .html(newMoreText)
                            .off('click')
                            .on("click", function(e){
                                var $theLink = $(this);

                                // Get array of children past the maximum option 
                                var $childrenSliced = $children.slice(op.max);

                                // Sequentially slideToggle the list items
                                // For more info on this awesome function: http://goo.gl/dW0nM
                                if ( $theLink.html() == newMoreText ){
                                    $(this).html(newLessText);
                                    var i = 0; 
                                    (function() { $($childrenSliced[i++] || []).slideToggle(speedPerChild,arguments.callee); })();
                                } 
                                else {			
                                    $theLink.html(newMoreText);
                                    var i = $childrenSliced.length - 1; 
                                    (function() { $($childrenSliced[i--] || []).slideToggle(speedPerChild,arguments.callee); })();
                                }

                                // Prevent Default Click Behavior (Scrolling)
                                e.preventDefault();
                            });
                } 
                else {
                    // LIST HAS LESS THAN THE MAX
                    // Hide "Read More" button if it's there
                    if ( $container.next(".toggle-children-link").length > 0 ){
                        $container.next(".toggle-children-link").hide();
                    }
                    // Show all list items that may have been hidden
                    $children.each(function(index){
                        $(this).show(0);
                    });
                }
            });
        }
    });
})(jQuery); // End jQuery Plugin