using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
   
    public class BusDriverController : Controller
    {
        private readonly IBusDriverService _busDriverService;

        public BusDriverController(IBusDriverService busDriverService)
        {
            _busDriverService = busDriverService;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<BusDriver>> GetById(string id)
        {
            BusDriver busDriver = await _busDriverService.GetBusDriverById(id);
            if(busDriver == null)
            {
                return NotFound();
            }
            return Ok(busDriver);
        }
        [HttpPost()]
        public async Task<ActionResult<bool>> Create(BusDriverDto busDriverDto)
        {
            bool isCreated = await _busDriverService.CreateBusDriver(busDriverDto);
            if(!isCreated)
            {
                return BadRequest(false);
            }
            return Ok(isCreated);
        }
        [HttpDelete("{Id}")]
        public async Task<ActionResult<bool>> Delete(string Id)
        {
            bool isDeleted  = await _busDriverService.DeleteBusDriver(Id);
            if(!isDeleted)
            {
                return BadRequest(false);
            }
            return Ok(isDeleted);
        }
        [HttpPut()]
        public async Task<ActionResult<BusDriver>> Update(string Id , BusDriverDto busDriverDto)
        {
            BusDriver busDriver = await _busDriverService.UpdateBusDriver(Id , busDriverDto);
            if(busDriver == null)
            {
                return BadRequest();
            }
            return Ok(busDriver);
        }

        
    }
}