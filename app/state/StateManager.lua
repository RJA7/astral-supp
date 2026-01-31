local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 1,["8"] = 1,["9"] = 3,["10"] = 3,["11"] = 4,["12"] = 4,["13"] = 8,["14"] = 8,["16"] = 8,["17"] = 13,["18"] = 14,["19"] = 14,["20"] = 14,["21"] = 14,["22"] = 13,["23"] = 20,["24"] = 21,["26"] = 21,["28"] = 22,["29"] = 23,["30"] = 20,["31"] = 26,["32"] = 27,["34"] = 27,["36"] = 26,["37"] = 30,["38"] = 35,["40"] = 35,["42"] = 30,["43"] = 39});
local ____exports = {}
local ____StateName = require("state.StateName")
local StateName = ____StateName.StateName
local ____CoreState = require("state.states.CoreState")
local CoreState = ____CoreState.CoreState
local ____MenuState = require("state.states.MenuState")
local MenuState = ____MenuState.MenuState
local StateManager = __TS__Class()
StateManager.name = "StateManager"
function StateManager.prototype.____constructor(self)
end
function StateManager.prototype.init(self)
    self.stateByName = {
        [StateName.Core] = __TS__New(CoreState),
        [StateName.Menu] = __TS__New(MenuState)
    }
end
function StateManager.prototype.switch(self, stateName)
    local ____opt_0 = self.currentState
    if ____opt_0 ~= nil then
        ____opt_0:exit()
    end
    self.currentState = self.stateByName[stateName]
    self.currentState:enter()
end
function StateManager.prototype.update(self, dt)
    local ____opt_2 = self.currentState
    if ____opt_2 ~= nil then
        ____opt_2:update(dt)
    end
end
function StateManager.prototype.onMessage(self, messageId, message, sender)
    local ____opt_4 = self.currentState
    if ____opt_4 ~= nil then
        ____opt_4:onMessage(messageId, message, sender)
    end
end
____exports.stateManager = __TS__New(StateManager)
return ____exports
