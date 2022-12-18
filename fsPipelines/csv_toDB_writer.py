import os
import warnings
warnings.filterwarnings('ignore')
from dagHelper import *
import configparser
source = "/run/media/solverbot/repoA/gitFolders/dashBoard Designs/fsPipelines/fileupload/"
dest = "/run/media/solverbot/repoA/gitFolders/dashBoard Designs/fsPipelines/fileCSV/"

name = os.listdir(source)[1]
sourceName = source + name
#The source dataframe is generated
destName = os.listdir(source)[1].split('.')[0]+".csv"
newDest = dest + destName.replace(' ','_')
tableName = os.listdir(source)[1].split('.')[0].replace(' ','_')

print(os.listdir(os.curdir))

config = configparser.ConfigParser()
config.read('clusterdash.config')
transformDB(newDest,tableName,config)
            
