import pandas as pd
import psycopg2
import os
import configparser
import warnings
warnings.filterwarnings('ignore')

#transformation function
def transformXL(fileLocation, worksheet = 'DataSource'):
    
    sourceDF = pd.read_excel(fileLocation,sheet_name='Datasource',header=0)
    
    frameCols = sourceDF.columns
    dropColumns = []
    
    for x in frameCols:
        if x.split(':')[0] == 'Unnamed':
            dropColumns.append(x)
    sourceDF.drop(dropColumns,inplace=True,axis=1)
    
    #Formatting the columns headers to 
    frameCols = sourceDF.columns
    cols = []
    for x in frameCols:
        temp = x.replace(" ",'_')
        temp = temp.replace("-","_")
        temp = temp.replace(":","_")
        cols.append(temp)
        
    sourceDF.columns = cols
    
    return sourceDF

def writeFS(dataframe, filename):
    dataframe.to_csv(filename,index=False)

def writeToDb(config, dataframe, tableName, fileLocation):
    
    #database connection data
    db = config['POSTGRES']['PG_DB']
    user = config['POSTGRES']['PG_UNAME']
    passwd = config['POSTGRES']['PG_PASS']
    port = config['POSTGRES']['PG_PORT']
    host = config['POSTGRES']['PG_HOST']

    try:
        conn = psycopg2.connect(host=host,dbname=db,user=user,password=passwd,port=port)
        conn.set_session(autocommit=True)
        cur = conn.cursor()

    except Exception as e:
        print(e)

    
    tableCreationQuery = schemaGen(dataframe,tableName)
    
    #Create table
    queryTable(cur,tableCreationQuery)
    
    #Create file copy query
    copyQuery = createCopyQuery(fileLocation,tableName)
    
    #Write data to the database
    
    queryTable(cur,copyQuery)
    
    print(f'Completed. Check the database by querying it with Select * FROM {tableName}')

#Using pandas read_sql for getting schema
def getSchema(tableName, credentials):
    schema = pd.read_sql("""SELECT * FROM information_schema.columns where table_name='{}'""".format(tableName),con=credentials)
    return schema

#Issue is in using pd.read_sql to write data to the database. so using psycopg2
def queryTable(cursor,query):
    try:
        schema = cursor.execute(query)

    except Exception as e:
        print(e)
        
#This doesn't return anything

#Using the pd.read_sql for getting data from db
def queryBase(query):
    requiredTable = pd.read_sql(query,con=credentials)
    return requiredTable

#This returns the dataframe

def schemaGen(dataframe, schemaName):
    localSchema = pd.io.sql.get_schema(dataframe,schemaName)
    localSchema = localSchema.replace('TEXT','VARCHAR(255)').replace('INTEGER','VARCHAR').replace('\n','').replace('"',"")
    return "".join(localSchema)

def createCopyQuery(csvFilePath, tableName):
    copyCsvData = f"""COPY {tableName} from '{csvFilePath}' DELIMITER ',' CSV HEADER"""
    return copyCsvData

def main():
    source = "/run/media/solverbot/repoA/gitFolders/dashBoard Designs/fsPipelines/fileupload/"
    dest = "/run/media/solverbot/repoA/gitFolders/dashBoard Designs/fsPipelines/fileCSV/"

    name = os.listdir(source)[1]
    sourceName = source + name
    #The source dataframe is generated
    sourceDF = transformXL(sourceName,'Datasource')
    #Create the new destination for the csvfile
    destName = os.listdir(source)[1].split('.')[0]+".csv"
    newDest = dest + destName.replace(' ','_')
   # print(os.listdir(os.curdir))
    writeFS(sourceDF,newDest)

    configFile = "/run/media/solverbot/repoA/gitFolders/dashBoard Designs/fsPipelines/clusterdash.config" 
    
    newTableName=os.listdir(source)[1].split('.')[0].replace(' ','_')
    config = configparser.ConfigParser()
    config.read(configFile)
    print(config['POSTGRES']['PG_UNAME'])
    #Write the file to database
    writeToDb(config, sourceDF, newTableName, newDest) 
    
if __name__=='__main__':
    main()
    
