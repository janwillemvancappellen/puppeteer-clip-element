module.exports = async (page, scenario, vp) => {
    console.log('SCENARIO > ' + scenario.label);
    
    const selector = scenario.selectors;

    await screenshotDOMElement(selector);

    async function screenshotDOMElement(selector) {
        const rect = await page.evaluate(selector => {
            const element = document.querySelector(selector);
            const {x, y, width, height} = element.getBoundingClientRect();
            const bodyHeight = document.body.clientHeight;
            
            return {left: x, top: y, width, height, bodyHeight}
        }, selector);

        // set viewport to make sure element is visible
        if (rect.bodyHeight > vp.height) {
            await page.setViewport({
                width: vp.width,
                height: rect.bodyHeight
            });
        }
        
        // Make screenshot of element
        return await page.screenshot({
            clip: {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            }
        });
    }
}