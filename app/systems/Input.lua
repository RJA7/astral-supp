local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Set = ____lualib.Set
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 2,["9"] = 2,["10"] = 3,["11"] = 3,["12"] = 4,["13"] = 4,["14"] = 6,["15"] = 6,["17"] = 7,["18"] = 6,["19"] = 9,["20"] = 10,["21"] = 9,["22"] = 13,["23"] = 14,["24"] = 13,["25"] = 17,["26"] = 18,["27"] = 19,["28"] = 18,["29"] = 17,["30"] = 23,["31"] = 25,["32"] = 29,["34"] = 23,["35"] = 34});
local ____exports = {}
local ____Message = require("systems.Message")
local postMessage = ____Message.postMessage
local ____ActionId = require("types.ActionId")
local ActionId = ____ActionId.ActionId
local ____MessageId = require("types.MessageId")
local MessageId = ____MessageId.MessageId
local Input = __TS__Class()
Input.name = "Input"
function Input.prototype.____constructor(self)
    self.listeners = __TS__New(Set)
end
function Input.prototype.register(self, listener)
    self.listeners:add(listener)
end
function Input.prototype.unregister(self, listener)
    self.listeners:delete(listener)
end
function Input.prototype.dispatch(self, actionId, action)
    self.listeners:forEach(function(____, listener)
        postMessage(nil, listener, MessageId.Input, {actionId = actionId, action = action})
    end)
end
function Input.prototype.onInput(self, actionId, action)
    if actionId == ActionId.touch or actionId == ActionId.mouse_button_1 or actionId == ActionId.mouse_move then
        self:dispatch(actionId, action)
    end
end
____exports.input = __TS__New(Input)
return ____exports
