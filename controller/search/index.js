const {searchInStorage} = require('../../service/search');
const {dmLogin} = require('../../service/login');
const {createResponse} = require("../../response");
class SearchController {
    async searchGoods(ctx,next){
        try {
            const result = await searchInStorage(ctx.query,ctx.state.DMDToken);
            ctx.body = createResponse('success',result);
        }catch (e) {
            ctx.body = createResponse('fail',e);
        }
    }

}
module.exports = new SearchController();
