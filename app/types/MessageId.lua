local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 1,["6"] = 1,["7"] = 1,["8"] = 3,["9"] = 4,["10"] = 7});
local ____exports = {}
local ____PatchEnum = require("utils.PatchEnum")
local patchEnum = ____PatchEnum.patchEnum
local toHash = ____PatchEnum.toHash
____exports.MessageId = MessageId or ({})
____exports.MessageId.Input = "Input"
patchEnum(nil, ____exports.MessageId, toHash)
return ____exports
