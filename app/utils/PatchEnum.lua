local ____lualib = require("lualib_bundle")
local __TS__ObjectEntries = ____lualib.__TS__ObjectEntries
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 1,["8"] = 5,["9"] = 5,["10"] = 5,["11"] = 5,["12"] = 5,["13"] = 5,["14"] = 5,["15"] = 7,["16"] = 5,["17"] = 5,["18"] = 1,["19"] = 11,["20"] = 12,["21"] = 11});
local ____exports = {}
function ____exports.patchEnum(self, enumeration, mapCb)
    __TS__ArrayForEach(
        __TS__ObjectEntries(enumeration),
        function(____, ____bindingPattern0)
            local value
            local key
            key = ____bindingPattern0[1]
            value = ____bindingPattern0[2]
            enumeration[key] = mapCb(nil, value)
        end
    )
end
function ____exports.toHash(self, value)
    return hash(value)
end
return ____exports
