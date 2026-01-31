local ____lualib = require("lualib_bundle")
local __TS__ObjectEntries = ____lualib.__TS__ObjectEntries
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 1,["8"] = 2,["9"] = 2,["10"] = 2,["11"] = 2,["12"] = 2,["13"] = 2,["14"] = 2,["15"] = 4,["16"] = 2,["17"] = 2,["18"] = 1});
local ____exports = {}
function ____exports.patchEnumToHash(self, enumeration)
    __TS__ArrayForEach(
        __TS__ObjectEntries(enumeration),
        function(____, ____bindingPattern0)
            local value
            local key
            key = ____bindingPattern0[1]
            value = ____bindingPattern0[2]
            enumeration[key] = hash(value)
        end
    )
end
return ____exports
