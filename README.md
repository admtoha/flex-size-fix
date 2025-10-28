# flex-size-fix
A Script for Evenly Distributing Blocks of Different Sizes

In reality, as of today (2025), distributing blocks of different sizes is not a trivial task.  To achieve:

 - Minimal and uniform gaps;
 - Support for various screen resolutions;
 - Responsiveness to dynamic page changes (container resizing, adding/removing/changing internal container blocks);
 - Minimal script impact to retain almost the full set of native CSS customization tools.

<h2>How to Use:</h2>

1.  Download the script "flex_size_fix.js".
2.  Include the script in your page, for example:<pre>
    &lt;script language="JavaScript" src="./flex_size_fix.js"&gt; &lt;/script&gt; </pre>
3.  Mark the target containers using the "data-flex-size-fix" attribute:<pre>
    ...
    &lt;div data-flex-size-fix&gt; 
    ...
    &lt;/div&gt; 
    ...</pre>

Next to the script, you'll find an interactive example/demonstration file. You can download it, place it in the same directory as the script, and observe the script in action.

<h2>How it Works</h2>

The target containers have the following CSS properties applied:
- display: flex;
- flex-flow: column wrap;

The script then calculates the optimal container height based on the content sizes.  It also sets up observation for page changes and recalculates the container height as needed.

Due to the principles of operation, the following CSS properties are not subject to change:
-  display;
-   flex-flow;
-   flex-direction;
-   flex-wrap;
-   flex-shrink;
-   flex-grow;
