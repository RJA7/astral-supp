local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 5,["6"] = 10,["7"] = 12,["8"] = 5,["9"] = 15,["10"] = 16,["11"] = 15});
local ____exports = {}
function ____exports.postMessage(self, receiver, messageId, message)
    local receiverUrl = type(receiver) == "string" and msg.url(receiver) or receiver
    msg.post(receiverUrl, messageId, message)
end
function ____exports.messageUrl(self, ref)
    return msg.url(ref)
end
return ____exports
