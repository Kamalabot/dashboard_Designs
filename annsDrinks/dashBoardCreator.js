const dataAquisition = async ()=>{
    const information = await d3.csv('databaseInformation.csv')
    // console.log(information)
    
    //Parsing and cleaning Data
    const parseDate = d3.timeParse("%d-%m-%Y");
    
    const numberFormat = d3.format(".2s")

    var monthNames= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];          

    const cleanSalePerfData = information.map(d=>({
        id: Number(d.Id),
        category: d.Categories,
        price: Number(d['Sals Price']),
        qty: Number(d.Qty),
        revenue: Number(d.Revenue),
        cost: Number(d.Cost),
        cogs: Number(d.Cogs),
        profit:Number(d.Profit),
        customerName: d['Customers'],
        gender: d.Gender,
        product: d['Drinks/Products'],
        dateSold: parseDate(d['Date']),
        reps: d['Sales Reps'],
        month: monthNames[parseDate(d['Date']).getMonth()],
        year:parseDate(d['Date']).getFullYear()
    }))

    const yearlySales = groupingSum(cleanSalePerfData,'year','revenue')
    
    barPlot(yearlySales,'saleBar','category','value','purple')

    // console.log(cleanSalePerfData)
    // Aggregate data points
    var totCogs, totCustomers, totProducts, totTransaction,totProfit;

    totCogs= sumSeries(cleanSalePerfData,'cogs')
    totProfit= sumSeries(cleanSalePerfData,'profit')
    totTransaction= cleanSalePerfData.length,

    //Grouping based on customers
    totCustomers= d3.rollups(cleanSalePerfData,v => v.length, d => d.customerName).length;
    totProducts= d3.rollups(cleanSalePerfData,v => v.length, d => d.product).length;

    // console.log(totCogs, totProfit,totCustomers, totTransaction, totProducts)

    var products= d3.rollups(cleanSalePerfData,v => v.length, d => d.product).map(d => ({
        product: d[0],
        count: d[1] 
    }));
    var customers= d3.rollups(cleanSalePerfData,v => v.length, d => d.customerName).map(d => ({
        product: d[0],
        count: d[1] 
    }));
    var categories= d3.rollups(cleanSalePerfData,v => v.length,d => d.category).map(d => ({
        product: d[0],
        count: d[1] 
    }));
    var reps = d3.rollups(cleanSalePerfData,v => v.length,d => d.reps).map(d => ({
        product: d[0],
        count: d[1] 
    }));
    // console.log(customers)
    var months = [... new Set(cleanSalePerfData.map(d => d.month))]
    // console.log(months)


    dataSentId(numberFormat(totProducts),"drinks")
    dataSentId(numberFormat(totCustomers),"custs")
    dataSentId(numberFormat(totCogs),"cogs")

    populateNav(cleanSalePerfData, categories,'categs')
    populateNav(cleanSalePerfData, products,'pdts')

    //Working on providing the event listeners to create explorations
    eventListenerAdd(cleanSalePerfData,"categs_0", "category", categories[0])
    eventListenerAdd(cleanSalePerfData,"categs_1", "category", categories[1])
    eventListenerAdd(cleanSalePerfData,"categs_2", "category", categories[2])

    eventListenerAdd(cleanSalePerfData,"pdts_0", "product", products[0].product)
    eventListenerAdd(cleanSalePerfData,"pdts_1", "product", products[1].product)
    eventListenerAdd(cleanSalePerfData,"pdts_2", "product", products[2].product)
    eventListenerAdd(cleanSalePerfData,"pdts_3", "product", products[3].product)
    eventListenerAdd(cleanSalePerfData,"pdts_4", "product", products[4].product)
    eventListenerAdd(cleanSalePerfData,"pdts_5", "product", products[5].product)
    eventListenerAdd(cleanSalePerfData,"pdts_6", "product", products[6].product)
    eventListenerAdd(cleanSalePerfData,"pdts_7", "product", products[7].product)
    eventListenerAdd(cleanSalePerfData,"pdts_8", "product", products[8].product)
    eventListenerAdd(cleanSalePerfData,"pdts_9", "product", products[9].product)
    eventListenerAdd(cleanSalePerfData,"pdts_10", "product", products[10].product)
    eventListenerAdd(cleanSalePerfData,"pdts_11", "product", products[11].product)
    eventListenerAdd(cleanSalePerfData,"pdts_12", "product", products[12].product)
    eventListenerAdd(cleanSalePerfData,"pdts_13", "product", products[13].product)
    eventListenerAdd(cleanSalePerfData,"pdts_14", "product", products[14].product)
    eventListenerAdd(cleanSalePerfData,"pdts_15", "product", products[15].product)
    eventListenerAdd(cleanSalePerfData,"pdts_16", "product", products[16].product)
    eventListenerAdd(cleanSalePerfData,"pdts_17", "product", products[17].product)
    eventListenerAdd(cleanSalePerfData,"pdts_18", "product", products[18].product)
    eventListenerAdd(cleanSalePerfData,"pdts_19", "product", products[19].product)
    eventListenerAdd(cleanSalePerfData,"pdts_20", "product", products[20].product)
    eventListenerAdd(cleanSalePerfData,"pdts_21", "product", products[21].product)
    eventListenerAdd(cleanSalePerfData,"pdts_22", "product", products[22].product)
    eventListenerAdd(cleanSalePerfData,"pdts_23", "product", products[23].product)
    eventListenerAdd(cleanSalePerfData,"pdts_24", "product", products[24].product)
    eventListenerAdd(cleanSalePerfData,"pdts_25", "product", products[25].product)
    eventListenerAdd(cleanSalePerfData,"pdts_26", "product", products[26].product)
    eventListenerAdd(cleanSalePerfData,"pdts_27", "product", products[27].product)
    eventListenerAdd(cleanSalePerfData,"pdts_28", "product", products[28].product)
    eventListenerAdd(cleanSalePerfData,"pdts_29", "product", products[29].product)
    eventListenerAdd(cleanSalePerfData,"pdts_30", "product", products[30].product)
    eventListenerAdd(cleanSalePerfData,"pdts_31", "product", products[31].product)
    eventListenerAdd(cleanSalePerfData,"pdts_32", "product", products[32].product)
    eventListenerAdd(cleanSalePerfData,"pdts_33", "product", products[33].product)

    eventListenerAdd(cleanSalePerfData,"gender_0", "gender", 'M')
    eventListenerAdd(cleanSalePerfData,"gender_1", "gender", 'F')

    eventListenerAdd(cleanSalePerfData,"year_0", "year", 2019)
    eventListenerAdd(cleanSalePerfData,"year_1", "year", 2020)

//     // console.log(filterPerformance(cleanSalePerfData,'month','July'))
//     barPlot(products, 'chart1', 'product', 'count', 'orange')
    const monthlySales = groupingSum(cleanSalePerfData,'month','revenue')
    const monthlyProfit = groupingSum(cleanSalePerfData,'month','profit')
    const monthlyCogs = groupingSum(cleanSalePerfData,'month','cogs')
    
    linePlot(monthlySales, 'monthSales', 'category', 'value', 'purple')

    var cogs = document.getElementById('cogsLine')
    cogs.addEventListener('click',()=>{
            if(cogs.checked){
                linePlot(monthlyCogs, 'monthSales', 'category', 'value', 'purple')
            }
    })

    var sales = document.getElementById('revenue')
    sales.addEventListener('click',()=>{
            if(sales.checked){
                linePlot(monthlySales, 'monthSales', 'category', 'value', 'purple')
            }
    })

    var profit = document.getElementById('profit')
    profit.addEventListener('click',()=>{
            if(profit.checked){
                linePlot(monthlyProfit, 'monthSales', 'category', 'value', 'purple')
            }
    })
}   

function groupingSum(dataset, category, reqdSum){
    var result = d3.rollups(dataset,v => d3.sum(v, f => f[reqdSum]), d => d[category]).map(d => ({
        category: d[0],
        value :d[1] 
    }))
    return result
}

function filterPerformance(dataset, filterCat, filterValue){
    let filterData = dataset.filter(d => d[filterCat] == filterValue)
    let consolidateData =[];
    let performanceMetrics = ['revenue', 'profit','cogs'];
    for( let perf of performanceMetrics){
        let makeReply = {feature: perf, data: sumSeries(filterData,perf)}
        consolidateData.push(makeReply)
    }
    console.log(consolidateData)
    barPlot(consolidateData,'categSales', 'feature','data','purple')
    // return consolidateData
}

function sumSeries(dataset, series){
    let sum = d3.sum(dataset, d => d[series])
    return sum
}

function dataSentId(value, id){
    let elt = document.getElementById(id)
    elt.textContent = value
}

function populateNav(mainDataSet,arrayList, id){
    let domId = document.getElementById(id)
    var idx = 0; 
    for(let elt of arrayList){
        let htmlFrag = `<a class="link dim black f3 dib mr3" href="#" id="${id}_${idx}" title="Link ${idx + 1}">${elt.product}</a>`
        domId.innerHTML += htmlFrag;
        //Adding Event listener to each link and initiating the values which it will filter
        idx += 1;
    } 
}

function eventListenerAdd(maindataset, id, filterCat, filterValue){
    // console.log(`Entering from ${id} with ${filterCat} and ${filterValue}`)
    let eleId = document.getElementById(id)
    eleId.addEventListener('click',()=>{
        console.log(`Entering from ${id} with ${filterCat} and ${filterValue}`)
        //maindataset is the data that hte filter will work on. filterCat is the category in the data
        let filteredData = filterPerformance(maindataset, filterCat, filterValue)
        console.log(filteredData)
    })
}

dataAquisition()