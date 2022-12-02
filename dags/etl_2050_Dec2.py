from airflow.models import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago

default_args = {
    'owner':'LocalRun',
    'start_date':days_ago(2)
}

dag = DAG(
    dag_id='etl_demo',
    default_args=default_args,
    schedule_interval="0 0 * * *",
    catchup=False
)

createDirOrders = BashOperator(
    task_id='createDirOrders',
    bash_command="mkdir -p /tmp/orders && sleep 10",
    dag=dag
)

createDirOrders

if __name__=="__main__":
    dag.cli()