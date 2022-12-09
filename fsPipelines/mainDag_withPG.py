import os
import warnings
warnings.filterwarnings('ignore')
from dagHelper import *
import configparser
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
#This is Dag File with connectivity to postgres throug pyspark and python operator
args = {
        'owner':'spacer'
}

config = configparser.ConfigParser()
config.read('calter.config')
with DAG(
        dag_id='Excel_CSV_PG_counter',
        default_args=args,
        schedule_interval='0 0 * * *',
        start_date=days_ago(2)
) as dag:
    t2 = PostgresOperator(
            task_id='t2',
            postgres_conn_id='my_new_db',
            sql='SELECT COUNT(*) FROM sales_data'
    )
    t2
if __name__ == "__main__":
    dag.cli()
            
