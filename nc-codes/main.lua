QBCore = exports['qb-core']:GetCoreObject()

RegisterCommand('usecode', function(source, args, rawCommand)
    local src = source
    local xPlayer = NCCore.Functions.GetPlayer(source)
    local code = table.concat(args, " ")

    exports['ghmattimysql']:execute('SELECT * FROM ncodes WHERE code = @code', {['@code'] = code}, function(result)

        if(result[1] == nil) then
            return TriggerClientEvent("NCCore:Notify", "The code doesn't exists")
        end

        exports['ghmattimysql']:execute('DELETE FROM ncodes WHERE code = @code', {['@code'] = code}, function(result) end)

        local type = result[1].type
        local amount = result[1].amount

        if type == "cash" or type == "bank" then
            xPlayer.Functions.AddMoney(type, amount)
            TriggerClientEvent("NCCore:Notify", src, string.format("You Redeemed A Money Token. %s Goes To Your %s", amount, type == "bank" or "Bank Account" and "Wallet"))
        elseif(type == "item") then
            xPlayer.Functions.AddItem(amount, 1, nil, nil)
            TriggerClientEvent("NCCore:Notify", src, string.format("You Redeemed A Item Token. You Got %s", amount))
        else
            TriggerClientEvent("NCCore:Notify", src, "Unknown Token Type!, You Will Not Get Anything")
        end
        
    end)
end)
