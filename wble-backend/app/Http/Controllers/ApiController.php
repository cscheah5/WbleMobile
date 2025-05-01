<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ApiController extends Controller
{
    public function successResponse(
        $data = [],
        string $message = 'Success',
        int $statusCode = 200,
    ) {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    public function errorResponse(
        string $message = 'error',
        int $statusCode = 400,
        array $errors = [],
    ) {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }
}
