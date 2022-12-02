from airflow.models import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago

default_args = {
    'owner':'LocalRun',
    'start_date':days_ago(2)
}

dag = DAG(
    dag_id='etl_demo_02',
    default_args=default_args,
    schedule_interval="0 0 * * *",
    catchup=False
)

createDirOrders = BashOperator(
    task_id='createDirOrders',
    bash_command="mkdir -p /home/solverbot/orders && sleep 10",
    dag=dag
)

getOrders = BashOperator(
    task_id='getOrders',
    bash_command='echo "Hello from orders at `date`" > /home/solverbot/orders/tempting.txt && sleep 60',
    dag=dag
)


dropOrders = BashOperator(
    task_id='dropOrders',
    bash_command="rm -rf /home/solverbot/orders",
    dag=dag
)

createDirOrders >> getOrders >> dropOrders

if __name__=="__main__":
    dag.cli()