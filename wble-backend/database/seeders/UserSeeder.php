<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'user1',
            'password' => '123456',
            'role' => 'student',
        ]);
        User::create([
            'username' => 'user2',
            'password' => '123456',
            'role' => 'student',
        ]);
        User::create([
            'username' => 'leemj',
            'password' => '123456',
            'role' => 'lecturer',
        ]);
        User::create([
            'username' => 'admin',
            'password' => '123456',
            'role' => 'admin',
        ]);
        User::factory()->count(10)->create();
    }
}
