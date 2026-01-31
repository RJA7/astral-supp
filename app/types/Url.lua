local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 1,["6"] = 2,["7"] = 3});
local ____exports = {}
____exports.Ref = Ref or ({})
____exports.Ref.CurrentGameObject = "."
____exports.Ref.CurrentComponent = "#"
return ____exports
