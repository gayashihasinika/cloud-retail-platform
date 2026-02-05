<?php
// services/notification-service/app/Models/AdminActivityLog.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminActivityLog extends Model
{
    protected $fillable = [
        'admin_id',
        'admin_name',
        'action',
        'entity_type',
        'entity_id'
    ];
}
