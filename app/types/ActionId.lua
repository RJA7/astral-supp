local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 1,["6"] = 1,["7"] = 1,["8"] = 3,["9"] = 4,["10"] = 5,["11"] = 6,["12"] = 9});
local ____exports = {}
local ____PatchEnum = require("utils.PatchEnum")
local patchEnum = ____PatchEnum.patchEnum
local toHash = ____PatchEnum.toHash
____exports.ActionId = ActionId or ({})
____exports.ActionId.touch = "touch"
____exports.ActionId.mouse_button_1 = "mouse_button_1"
____exports.ActionId.mouse_move = "mouse_move"
patchEnum(nil, ____exports.ActionId, toHash)
return ____exports
