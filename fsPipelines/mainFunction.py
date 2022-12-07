#This file will contain the main functions to run the files going to Airflow
import pandas as pd
import psycopg2
import os
import configparser
import warnings
warnings.filterwarnings('ignore')
from helperFunctions import *

def main():
    source = "/run/media/solverbot/repoA/gitFolders/dashBoard Designs/fsPipelines/fileupload/"
    dest = "/run/media/solverbot/repoA/gitFolders/dashBoard Designs/fsPipelines/fileCSV/"

    name = os.listdir(source)[1]
    sourceName = source + name
    #The source dataframe is generated
    sourceDF = transformXL(sourceName,'StoreData')
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
    
