#!/usr/bin/env python
import pyspark
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
#transformation function

import warnings
warnings.filterwarnings('ignore')
#get the user input for filename and table name.
fileName = input("Please provide the CSV file name to upload to DB: ")
tableName= input("Please provide the table name to be used in DB: ")
databaseName= input("Please provide the database name to write the table: ")

def transformDB(fileLocation,tableName,database):
    #Starting spark with database connectivity
    #database connection data
    db =database
    user ='postgres' 
    passwd =1234 
    port = 5432
    host ='172.17.0.2' 


    spark = SparkSession.builder.appName("KPI"). \
            config('spark.jars','/usr/share/java/postgresql-42.2.26.jar'). \
            getOrCreate()
    sparkread = spark.read
    sparkcon = spark.sparkContext
    
    sourceDF = sparkread.csv(fileLocation,inferSchema=True,
                            header=True)
    print(f"Starting the write process to {db}")
    try:
        sourceDF.write.format("jdbc") \
            .option("url",f"jdbc:postgresql://{host}:{port}/{db}") \
            .option("dbtable",f"{tableName}") \
            .option("user",f"{user}") \
            .option("password",f"{passwd}") \
            .option("driver","org.postgresql.Driver") \
            .save(mode='overwrite')
    except Exception as e:
        print(f"Encountered {e} check database is up and running!!!")
    print(f"Completed the write process to table {tableName}")

transformDB(fileName,tableName)
            
