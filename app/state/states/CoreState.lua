local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 5,["7"] = 7,["8"] = 7,["9"] = 7,["11"] = 7,["12"] = 8,["13"] = 10,["14"] = 11,["15"] = 8,["16"] = 14,["17"] = 15,["18"] = 14,["19"] = 18,["20"] = 18,["21"] = 20,["22"] = 20});
local ____exports = {}
local CORE_PROXY = "/state_loader#core_proxy"
____exports.CoreState = __TS__Class()
local CoreState = ____exports.CoreState
CoreState.name = "CoreState"
function CoreState.prototype.____constructor(self)
end
function CoreState.prototype.enter(self)
    msg.post(CORE_PROXY, "load")
    msg.post(CORE_PROXY, "enable")
end
function CoreState.prototype.exit(self)
    msg.post(CORE_PROXY, "unload")
end
function CoreState.prototype.update(self, _dt)
end
function CoreState.prototype.onMessage(self, _messageId, _message, _sender)
end
return ____exports
