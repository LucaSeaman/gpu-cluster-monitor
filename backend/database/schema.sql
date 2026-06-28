CREATE TABLE IF NOT EXISTS gpu_telemetry {
    id SERIAL PRIMARY KEY,
    node_id INT NOT NULL,
    workload_type INT NOT NULL,
    temperature NUMERIC(5,2) NOT NULL,
    fan_speed NUMERIC(5,2) NOT NULL, 
    power_draw NUMERIC(5,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
};

CREATE INDEX IF NOT EXISTS idx_gpu_node_time ON gpu_telemetry (node_id, recorded_at DESC);