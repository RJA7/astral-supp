local M = {}

function M.remove_value(arr, value)
    for i = #arr, 1, -1 do
        if arr[i] == value then
            table.remove(arr, i)
        end
    end
end

function M.find(arr, value)
    for i = 1, #arr do
        if arr[i] == value then
            return i
        end
    end
end

return M
