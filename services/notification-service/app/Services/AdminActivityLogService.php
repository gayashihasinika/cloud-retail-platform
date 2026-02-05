<?php

// services/notification-service/app/Services/AdminActivityLogService.php
namespace App\Services;

use App\Models\AdminActivityLog;

class AdminActivityLogService
{
    public static function log(
        $admin,
        string $action,
        string $entityType,
        int $entityId
    ) {
        AdminActivityLog::create([
            'admin_id'   => $admin->id,
            'admin_name' => $admin->name,
            'action'     => $action,
            'entity_type'=> $entityType,
            'entity_id'  => $entityId,
        ]);
    }
}
