const {printStorageGoods} = require('../../service/print');
const {createResponse} = require("../../response");
class SearchController {
    async printGoodsLabel(ctx,next){
        try {
            const {goodId,printAmount,goodAmount,remarks} = ctx.query;
            ctx.body = createResponse(
                'success',
                await printStorageGoods(goodId, ctx.state.DMDToken, printAmount || 1, goodAmount || 1,remarks),

            );

        }catch (e) {
            ctx.body = createResponse('fail',e);
        }
    }

}
module.exports = new SearchController();
